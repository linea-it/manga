import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API;

export const getFluxByPosition = ({ id, x, y }) => {
  const params = { x, y };

  return axios
    .get(`/images/${id}/flux_by_position`, { params })
    .then((res) => res.data);
};

export const getSpaxelFitByPosition = ({ id, x, y }) => {
  const params = { x, y };

  return axios
    .get(`/images/${id}/spaxel_fit_by_position`)
    .then((res) => res.data, { params });
};

export const getOriginalImageHeatmap = (id) =>
  axios.get(`/images/${id}/original_image/`).then((res) => res.data);

export const getImageHeatmap = (id, hud) => {
  const params = { hud };

  return axios
    .get(`/images/${id}/image_heatmap/`, { params })
    .then((res) => res.data);
};

export const getAllImagesHeatmap = (id) => {
  return axios.get(`/images/${id}/all_images_heatmap/`).then((res) => res.data);
};

export const getHudList = (id) =>
  axios.get(`/images/${id}/list_hud/`).then((res) => res.data);

export const getMegacubesList = ({
  ordering,
  pageSize,
  page,
  search,
  filter,
}) => {
  let sorting = '';
  const sortingColumn = ordering[0];

  if (sortingColumn.direction === 'asc') {
    sorting = sortingColumn.columnName;
  } else {
    sorting = `-${sortingColumn.columnName}`;
  }

  const params = {
    page,
    pageSize,
    search,
    ordering: sorting,
  };

  return axios
    .get(`/images/?${filter.join('&')}`, { params })
    .then((res) => res.data);
};

export const getLogAgeByPosition = ({ id, x, y }) => {
  const params = { x, y };

  return axios
    .get(`/images/${id}/log_age_by_position`, { params })
    .then((res) => res.data);
};

export const getVecsByPosition = ({ id, x, y }) => {
  const params = { x, y };

  return axios
    .get(`/images/${id}/vecs_by_position`, { params })
    .then((res) => res.data);
};

export const getHeader = (id) =>
  axios.get(`/images/${id}/megacube_header`).then((res) => res.data);

export const getDownloadInfo = (id) =>
  axios.get(`/images/${id}/download_info`).then((res) => res.data);
