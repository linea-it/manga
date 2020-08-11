import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API;


export const getFluxByPosition = ({ x, y, megacube }) =>
  axios.get(`/flux_by_position?megacube=${megacube}.fits&x=${x}&y=${y}`)
    .then(res => res.data)

export const getSpaxelFitByPosition = ({ x, y, megacube }) =>
  axios.get(`/spaxel_fit_by_position?megacube=${megacube}.fits&x=${x}&y=${y}`)
    .then(res => res.data)

export const getOriginalImageHeatmap = ({ megacube }) =>
  axios.get(`/original_image_heatmap?megacube=${megacube}.fits`)
    .then(res => res.data)

export const getImageHeatmap = ({ megacube, hud }) =>
  axios.get(`/image_heatmap?megacube=${megacube}.fits&hud=${hud}`)
    .then(res => res.data)

export const getHudList = ({ megacube }) =>
  axios.get(`/list_hud?megacube=${megacube}.fits`)
    .then(res => ({ hud: res.data.hud.sort((a, b) => (a.name > b.name) ? 1 : -1), download: res.data.download }))


export const getMegacubesList = () =>
  axios.get('/list_megacubes')
    .then(res => res.data)

export const getLogAgeByPosition = ({ megacube, x, y }) =>
  axios.get(`/log_age_by_position?megacube=${megacube}.fits&x=${x}&y=${y}`)
    .then(res => res.data)

export const getVecsByPosition = ({ megacube, x, y }) =>
  axios.get(`/vecs_by_position?megacube=${megacube}.fits&x=${x}&y=${y}`)
    .then(res => res.data)

export const getHeader = ({ megacube }) =>
  axios.get(`/megacube_header?megacube=${megacube}.fits`)
    .then(res => res.data)