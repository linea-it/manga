import React, { } from 'react';
import { useInfiniteQuery } from 'react-query'
import { Grid, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { getImagesHeatmap } from '../../../../services/api';
import Plot from 'react-plotly.js';
import GenericError from '../../../../components/Alerts/GenericError';
import { useInView } from 'react-intersection-observer'

export default function ExplorerGridLayout({
  galaxy,
}) {

  const { ref, inView } = useInView({ threshold: 0.30 })
  const [errorIsOpen, setErrorIsOpen] = React.useState(false)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['ImagesByGalaxyId', { id: galaxy.id }],
    queryFn: async ({
      pageParam = 0,
      id = galaxy.id }) => { return getImagesHeatmap({ id, pageParam }) },
    getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnmount: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    onError: () => { setErrorIsOpen(true) }
  })

  React.useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  function generate_skeleton(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

  function loading_layout() {
    return (
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
      >
        {generate_skeleton(
          <Box sx={{ width: 400, height: 400 }} bgcolor="grey.300" m={2} />
        )}
      </Box>
    )
  }

  function plot(hdu) {
    return (
      <Box>
        <Typography variant="h6" align="center">
          {hdu.name}
        </Typography>
        <Typography variant="subtitle1" align="center">
          ({hdu.comment})
        </Typography>
        <Plot
          data={[
            {
              z: hdu.error ? [] : hdu.z,
              type: 'heatmap',
              colorscale: 'Viridis',
              showscale: true,
            },
          ]}
          layout={{
            hovermode: 'closest',
            yaxis: {
              scaleanchor: 'x',
            },
            margin: {
              t: 0,
              pad: 0,
              autoexpand: true,
            },
          }}
          config={{
            scrollZoom: false,
            displaylogo: false,
            responsive: true,
            displayModeBar: false,
            staticPlot: true,
          }}
          transition={{
            duration: 300,
            easing: 'cubic-in-out',
          }}
          frame={{ duration: 300 }}
        />
      </Box>
    )
  }
  if (isLoading) { return loading_layout()}
  return (
    // https://tanstack.com/query/v4/docs/react/examples/react/load-more-infinite-scroll
    // https://github.com/danbovey/react-infinite-scroller#readme
    <Box>
      {/* {isLoading && loading_layout()} */}
      {errorIsOpen && (<GenericError open={errorIsOpen} onClose={() => setErrorIsOpen(false)} />)}
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={2}
      >
        {data?.pages.map((page, idx) => (
          <React.Fragment key={{idx}}>
            {page.data.map((hdu, idx) => (
              <Grid key={{idx}} item
                xs={12}
                sm={6}
                md={4}
                xl={3}>
                {plot(hdu)}
              </Grid>
            ))}
          </React.Fragment>
        ))}
      </Grid>
      <Box height={300} ref={ref}>
        {isFetchingNextPage && (loading_layout())}
      </Box>
    </Box>
  );
}
ExplorerGridLayout.defaultProps = {
  galaxy: undefined
}
ExplorerGridLayout.propTypes = {
  galaxy: PropTypes.object
};

