import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

function Description() {

    return (
        <Card>
        <CardContent>        
        <Typography variant="body1" component="span">
            <p>
                <span>
                    We present spaxel-by-spaxel stellar population fits for the more than 10 thousand
                </span>{' '}
                <Link
                    href="https://www.sdss4.org/surveys/manga/"
                    target="_blank"
                    rel="noreferrer"
                    color="secondary"
                >
                    SDSS MaNGA
                </Link>{' '}
                <span>datacubes.  All data distributed here follows the SDSS acknowledgment rules.  We provide multiple extension .fits files, referred to as MEGACUBES, with maps of several properties and emission-line profiles provided for each spaxel and a table with the mean properties over different galaxy radii. For more details and description of the figures presented here see</span>{' '}
                <Link
                    href="https://ui.adsabs.harvard.edu/abs/2023arXiv230711474R/abstract"
                    target="_blank"
                    rel="noreferrer"
                    color="secondary"
                >
                    Riffel et al 2023.
                </Link>
            </p>
            <p>
                <span>
                    To enter the portal click on the figure.
                </span>
            </p>
        </Typography>
        </CardContent>
          </Card>        
    );
}

export default Description;
