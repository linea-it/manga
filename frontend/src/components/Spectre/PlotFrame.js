import React from 'react';
// import Plot from 'react-plotly.js';
import { CardMedia } from '@material-ui/core';
// import styles from './styles';

function PlotFrame() {
//   const classes = styles();

    return (
            <CardMedia
                component="iframe"
                height="100%"
                frameBorder="0"
                src="/data/megacube_parts/manga-9894-3701-MEGACUBE_spec_plot_35_28.html"
                style={{
                    minHeight: '400px'
                }}
            />
        // <Card>
        //     <CardHeader title='Asteroid Graphic' />
        //     <CardMedia
        //         component="iframe"
        //         height="100%"
        //         frameBorder="0"
        //         src={"/data/megacube_parts/manga-9894-3701-MEGACUBE_spec_plot_35_28.html"}
        //         style={{
        //             minHeight: '30vw'
        //         }}
        //     />
        // </Card>
    )

    // return (
    //     <Card>
    //       <CardHeader title='Asteroid Graphic' />
    //           {/* {orbitTraceResult.status != 2 && <>          
    //             {observationPlotError && <CardContent>
    //                 <label className={classes.errorText}>An error occurred while the plot was generated</label>
    //             </CardContent>}
    //         {!observationPlotError && observationPlot === '' && <CircularProgress className={classes.loadingPlot} disableShrink size={100} />}
    //         {!observationPlotError && observationPlot !== "" && ( */}
    //           <CardMedia
    //             component="iframe"
    //             height="100%"
    //             frameBorder="0"
    //             src={"http://localhost/data/megacube_parts/manga-9894-3701/manga-9894-3701-MEGACUBE_spec_plot_35_28.html"}
    //           />
    //         {/* )}
    //       </>} */}
    //     </Card>
    // )
}

export default PlotFrame;