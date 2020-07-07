import os

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from verifyer import mclass

import fnmatch

import json

application = Flask(__name__)
cors = CORS(application, resources={r"/*": {"origins": "*"}})


def get_megacube_path(filename):
    return os.path.join(os.getenv("IMAGE_PATH", "/images"), filename)


@application.route('/api')
def hello():
    content = open('flux.html').read()
    return Response(content, mimetype="text/html")


@application.route('/api/health_check')
def health_check():
    return jsonify(dict({'success': True}))


@application.route('/api/flux_by_position')
def flux_by_position():
    """
        Retorna o Fluxo e lambda para uma posicao x,y.


        Exemplo de requisicao.
        http://localhost/flux_by_position?megacube=manga-8138-6101-MEGA.fits&x=25&y=26
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    if 'x' not in args:
        raise Exception("Parameter x is required")

    if 'y' not in args:
        raise Exception("Parameter y is required")

    megacube = get_megacube_path(args['megacube'])

    flux, lamb = mclass().flux_by_position(
        megacube, int(args['x']), int(args['y']))

    synt, lamb2 = mclass().synt_by_position(
        megacube, int(args['x']), int(args['y']))

    result = dict({
        'flux': flux.tolist(),
        'lamb': lamb.tolist(),
        'synt': synt.tolist(),
    })

    response = jsonify(result)

    return response


@application.route('/api/image_heatmap')
def image_heatmap():
    """
        Retorna os dados que permitem plotar a imagem usando um heatmap.
        Exemplo de Requisicao: http://localhost/image_2d_histogram?megacube=manga-8138-6101-MEGA.fits&hud=xyy
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    if 'hud' not in args:
        raise Exception("Parameter hud is required")

    megacube = get_megacube_path(args['megacube'])

    image_data = mclass().image_by_hud(
        megacube, args['hud'])

    z = mclass().image_data_to_array(image_data)

    result = dict({
        'z': z,
        'title': args['hud'],
    })

    response = jsonify(result)

    return response

@application.route('/api/original_image_heatmap')
def original_image_heatmap():
    """
        Retorna a primeira imagem, a original (zero).
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    megacube = get_megacube_path(args['megacube'])

    cube_data = mclass().get_original_cube_data(megacube)

    result = dict({
        'z': cube_data,
        'title': 'FLUX',
    })

    response = jsonify(result)

    return response

@application.route('/api/original_image_heatmap_json')
def original_image_heatmap_json():
    """
        Retorna a primeira imagem, a original (zero).
    """

    megacube = get_megacube_path('manga.json')

    megacube_dict = {}

    with open(megacube) as f:
        megacube_dict = json.load(f)


    return megacube_dict

@application.route('/api/list_hud')
def list_hud():
    """
        Retorna a lista de HUD disponivel em um megacube.
        Exemplo de requisicao: http://localhost/list_hud?megacube=manga-8138-6101-MEGA.fits
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    megacube = get_megacube_path(args['megacube'])

    cube_header = mclass().get_headers(megacube, 'PoPBins')

    cube_data = mclass().get_cube_data(megacube, 'PoPBins')

    lHud = mclass().get_all_hud(
        cube_header, cube_data)

    dHud = list()
    for hud in lHud:
        # TODO recuperar o display name para cada HUD
        dHud.append({
            'name': hud,
            'display_name': hud
        })

    result = dict({
        'hud': dHud
    })

    response = jsonify(result)

    return response


@application.route('/api/spaxel_fit_by_position')
def spaxel_fit_by_position():
    """
        Retorna o "Central Spaxel Best Fit" para uma posicao x,y.

        Exemplo de requisicao.
        http://localhost/spaxel_fit_by_position?megacube=manga-8138-6101-MEGA.fits&x=15&y=29
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    if 'x' not in args:
        raise Exception("Parameter x is required")

    if 'y' not in args:
        raise Exception("Parameter y is required")

    megacube = get_megacube_path(args['megacube'])

    spaxel = mclass().spaxel_fit_by_position(
        megacube, int(args['x']), int(args['y']))

    result = dict({
        'columns': ['age', 'z', 'lfrac', 'mfrac'],
        'rows': spaxel,
        'count': len(spaxel),
        'title': "Best fit for Spaxel x= %s and y= %s" % (int(args['x']), int(args['y'])),
    })

    response = jsonify(result)

    return response


@application.route('/api/log_age_by_position')
def log_age_by_position():
    """
        Retorna o "Central Spaxel Best Fit" para uma posicao x,y.

        Exemplo de requisicao.
        http://localhost/spaxel_fit_by_position?megacube=manga-8138-6101-MEGA.fits&x=15&y=29
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    if 'x' not in args:
        raise Exception("Parameter x is required")

    if 'y' not in args:
        raise Exception("Parameter y is required")

    megacube = get_megacube_path(args['megacube'])

    log_age = mclass().log_age_by_position(
        megacube, int(args['x']), int(args['y']))

    response = jsonify(log_age)

    return response

@application.route('/api/vecs_by_position')
def vecs_by_position():
    """
        Retorna o "Central Spaxel Best Fit" para uma posicao x,y.

        Exemplo de requisicao.
        http://localhost/spaxel_fit_by_position?megacube=manga-8138-6101-MEGA.fits&x=15&y=29
    """
    args = request.args.to_dict()

    if 'megacube' not in args:
        raise Exception("Parameter megacube is required")

    if 'x' not in args:
        raise Exception("Parameter x is required")

    if 'y' not in args:
        raise Exception("Parameter y is required")

    megacube = get_megacube_path(args['megacube'])

    vecs = mclass().vecs_by_position(
        megacube, int(args['x']), int(args['y']))

    response = jsonify(vecs)

    return response


if __name__ == '__main__':
    application.run(debug=True)


@application.route('/api/list_megacubes')
def list_megacubes():
    """
        Retorna a lista de megacubos disponíveis.
        Exemplo de requisicão: http://localhost/api/list_megacubes
    """
    megacubes = []

    for file in os.listdir(os.getenv("IMAGE_PATH", "/images")):
        if fnmatch.fnmatch(file, '*.fits'):
            megacubes.append(file)

    result = dict({
        'megacubes': megacubes,
        'count': len(megacubes),
    })

    response = jsonify(result)

    return response
