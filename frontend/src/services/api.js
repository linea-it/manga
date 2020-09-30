import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API;


export const getFluxByPosition = ({ id, x, y, }) => {
  const params = { x, y }

  return axios.get(`/images/${id}/flux_by_position`, { params })
    .then(res => res.data)
}

export const getSpaxelFitByPosition = ({ id, x, y, }) => {
  const params = { x, y }

  return axios.get(`/images/${id}/spaxel_fit_by_position`)
    .then(res => res.data)
}

export const getOriginalImageHeatmap = (id) =>
  axios.get(`/images/${id}/original_image/`)
    .then(res => res.data)

export const getImageHeatmap = (id, hud) => {
  const params = { hud }

  return axios.get(`/images/${id}/image_heatmap/`, { params })
    .then(res => res.data)
}


export const getHudList = (id) =>
  axios.get(`/images/${id}/list_hud/`)
    .then(res => ({ hud: res.data.hud, download: res.data.download }))


export const getMegacubesList = ({ ordering, pageSize, page, search }) => {

  let sorting = '';
  const sortingColumn = ordering[0];

  if(sortingColumn.direction === 'asc') {
    sorting = sortingColumn.columnName;
  } else {
    sorting = `-${sortingColumn.columnName}`;
  }

  const params = {
    page,
    pageSize,
    search,
    ordering: sorting
  }

  return axios.get('/images/', { params })
    .then(res => res.data)
}

export const getLogAgeByPosition = ({ id, x, y }) => {
  const params = { x, y }

  return axios.get(`/images/${id}/log_age_by_position`, { params })
    .then(res => res.data)
}


export const getVecsByPosition = ({ id, x, y }) => {
  const params = { x, y }

  return axios.get(`/images/${id}/vecs_by_position`, { params })
    .then(res => res.data)
}

export const getHeader = (id) =>
  axios.get(`/images/${id}/megacube_header`)
    .then(res => res.data)
