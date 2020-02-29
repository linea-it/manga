import React from 'react';

function Galaxy() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Card>
          <CardHeader
            title="Galaxy"
          />
          <SizeMe monitorHeight>
            {({ size }) => {
              if (size.height) {
                setHeatmapSize(size);
              }
              return (
                <CardContent>
                  {selectedImage.id === 0 ? (
                    <Skeleton height={selectedImage.id !== 0 && size && size.height ? size.height - 2 : 20} />
                  ) : (
                    <Grid container spacing={2} className={classes.animateEnter}>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <form autoComplete="off">
                              <FormControl fullWidth className={classes.textAlignLeft}>
                                <InputLabel htmlFor="input">Image</InputLabel>
                                <Select
                                  value={selectedImage.id || 0}
                                  onChange={handleSelectImage}
                                  disabled={selectedMegacube === ''}
                                >
                                  {hudList.map((hud, i) => (
                                    <MenuItem
                                      key={hud.name}
                                      value={i + 1}
                                    >
                                      {hud.display_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </form>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <form autoComplete="off">
                              <FormControl fullWidth className={classes.textAlignLeft}>
                                <InputLabel htmlFor="input">Contour</InputLabel>
                                <Select
                                  value={selectedContour.id}
                                  onChange={handleSelectContour}
                                  disabled={selectedMegacube === ''}
                                >
                                  {hudList.filter((image, i) => i + 1 !== selectedImage.id).map((hud, i) => (
                                    <MenuItem
                                      key={hud.name}
                                      value={i + 1}
                                    >
                                      {hud.display_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </form>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Plot
                          data={[
                            {
                              z: heatmapError === '' ? heatmapPlotImageData.z : [],
                              type: 'heatmap',
                              colorscale: 'Viridis',
                              fixedrange: true,
                              zauto: false,
                              zmin: heatmapColorRangeValue[0],
                              zmax: heatmapColorRangeValue[1],
                              hoverinfo: 'x+y+z',
                            },
                            {
                              z: heatmapError === '' ? heatmapPlotContourData.z : [],
                              type: 'contour',
                              showlegend: false,
                              contours: {
                                coloring: 'none',
                              },
                              line: {
                                color: 'white',
                                smoothing: 0.85,
                              },
                            },
                            {
                              type: 'scatter',
                              x: [heatmapPoints[0] === 0
                                ? null
                                : heatmapPoints[0], 0],
                              y: [heatmapPoints[1] === 0
                                ? null
                                : heatmapPoints[1], heatmapPoints[1]],
                              mode: 'lines',
                              line: {
                                color: 'rgba(255, 255, 255, .7)',
                                width: 6,
                              },
                              hoverinfo: 'x+y',
                              showlegend: false,
                            },
                            {
                              type: 'scatter',
                              x: [heatmapPoints[0] === 0
                                ? null
                                : heatmapPoints[0], heatmapPoints[0]],
                              y: [heatmapPoints[1] === 0
                                ? null
                                : heatmapPoints[1], 0],
                              mode: 'lines',
                              line: {
                                color: 'rgba(255, 255, 255, .4)',
                                width: 6,
                              },
                              hoverinfo: 'x+y',
                              showlegend: false,
                            },
                            {
                              x: [heatmapPoints[0] === 0
                                ? null
                                : heatmapPoints[0]],
                              y: [heatmapPoints[1] === 0
                                ? null
                                : heatmapPoints[1]],
                              type: 'scatter',
                              mode: 'markers',
                              marker: {
                                color: 'rgba(0, 0, 0, .8)',
                                size: 13,
                                line: {
                                  color: 'rgba(255, 255, 255, .5)',
                                  width: 3,
                                },
                              },
                              hoverinfo: 'x+y',
                              showlegend: false,
                            },
                            {
                              type: 'scatter',
                              x: [heatmapPoints[0] === 0
                                ? null
                                : heatmapPoints[0], 0],
                              y: [heatmapPoints[1] === 0
                                ? null
                                : heatmapPoints[1], heatmapPoints[1]],
                              mode: 'lines',
                              line: {
                                color: 'rgba(0, 0, 0, .8)',
                                width: 3,
                                dash: 'dot',
                              },
                              hoverinfo: 'x+y',
                              showlegend: false,
                            },
                            {
                              type: 'scatter',
                              x: [heatmapPoints[0] === 0
                                ? null
                                : heatmapPoints[0], heatmapPoints[0]],
                              y: [heatmapPoints[1] === 0
                                ? null
                                : heatmapPoints[1], 0],
                              mode: 'lines',
                              line: {
                                color: 'rgba(0, 0, 0, .8)',
                                width: 3,
                                dash: 'dot',
                              },
                              hoverinfo: 'x+y',
                              showlegend: false,
                            },
                          ]}
                          className={classes.plotWrapper}
                          layout={{
                            hovermode: 'closest',
                            colorscale: {
                              zmin: heatmapColorRangeValue[0],
                              zmax: heatmapColorRangeValue[1],
                            },
                            width: size && size.width ? size.width - 50 : 0,
                            height: size && size.width ? size.width - 50 : 0,
                            title: selectedImage.name,
                            yaxis: {
                              scaleanchor: 'x',
                            },
                            showSendToCloud: true,
                          }}
                          config={{
                            scrollZoom: false,
                            displaylogo: false,
                            responsive: true,
                            displayModeBar: 'hover',
                          }}
                          transition={{
                            duration: 500,
                            easing: 'cubic-in-out',
                          }}
                          frame={{ duration: 500 }}
                          onClick={handleHeatmapClick}
                        />

                        <HeatmapColorRange
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 191,
                            maxHeight: heatmapSize.height - 369,
                          }}
                          orientation="vertical"
                        // aria-label="Heatmap Color Range"
                          max={heatmapValueLimits[1]}
                          min={heatmapValueLimits[0]}
                          value={heatmapColorRangeValue}
                          valueLabelDisplay="off"
                          className={classes.colorRange}
                          onChange={handleHeatmapColorRangeChange}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <HeatmapSlider
                        // aria-label="Heatmap Slider"
                          max={hudList.length}
                          min={1}
                          value={heatmapSliderValue}
                          marks
                          step={1}
                          valueLabelDisplay="on"
                          className={classes.slider}
                          onChange={handleHeatmapSliderChange}
                        />

                        <IconButton
                          onClick={handlePlayClick}
                          title="Play"
                          className={classes.playButton}
                        >
                          <Icon className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                        </IconButton>
                      </Grid>
                      {heatmapError !== '' ? (
                        <Snackbar
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          open={heatmapError !== ''}
                        >
                          <SnackbarContent
                            className={classes.error}
                            aria-describedby="client-snackbar"
                            message={(
                              <span className={classes.message}>
                                <Icon className={clsx('fa fa-exclamation-triangle', classes.iconError)} />
                                {heatmapError}
                              </span>
                        )}
                          />
                        </Snackbar>
                      ) : null}
                    </Grid>
                  )}
                </CardContent>
              );
            }}
          </SizeMe>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader
            title="Spectre"
          />
          <CardContent>
            {heatmapPoints[0] !== 0 && heatmapPoints[1] !== 0 ? (
              <div className={classes.animateEnter}>
                <Plot
                  data={[
                    {
                      x: fluxPlotData.lamb,
                      y: fluxPlotData.flux,
                      name: 'Flux',
                    },
                    {
                      x: fluxPlotData.lamb,
                      y: fluxPlotData.synt,
                      name: 'Synt',
                    },
                  ]}
                  className={classes.plotWrapper}
                  layout={{
                    hovermode: 'closest',
                    autosize: true,
                    height: heatmapSize && heatmapSize.height ? heatmapSize.height - 40 : 0,
                    title: `x=${heatmapPoints[0]}, y=${heatmapPoints[1]}`,
                  }}
                  config={{
                    scrollZoom: false,
                    displaylogo: false,
                    responsive: true,
                    displayModeBar: 'hover',
                  }}
                  transition={{
                    duration: 500,
                    easing: 'cubic-in-out',
                  }}
                  frame={{ duration: 500 }}
                />
              </div>
            ) : (
              <Skeleton height={selectedImage.id !== 0 && heatmapSize && heatmapSize.height ? heatmapSize.height - 40 : 20} />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Galaxy;
