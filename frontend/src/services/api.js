import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API;

export const getGalaxyById = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id } = params
  if (!id) {
    return
  }

  return axios.get(`/images/${id}/`).then(res => res.data)
}

export const getMegacubeHeadersById = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id } = params
  if (!id) {
    return
  }

  return axios.get(`/images/${id}/megacube_header`).then(res => res.data)
}

export const getMegacubeDownloadInfo = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id } = params
  if (!id) {
    return
  }

  return axios.get(`/images/${id}/download_info`).then(res => res.data)
}

export const getHdus = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id } = params
  if (!id) {
    return
  }

  return axios.get(`/images/${id}/hdus`).then(res => res.data)
}

export const getAllHeatmaps = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id } = params
  if (!id) {
    return
  }

  return axios.get(`/images/${id}/all_images_heatmap`).then(res => res.data)
}

export const getImagesHeatmap = ({ id, pageParam }) => {
  return axios.get(`/images/${id}/images_heatmap`, { params: { cursor: pageParam } }).then(res => res.data)
}

export const getFluxByPosition = ({ id, x, y }) => {
  const params = { x, y };
  if (!id || !x || !y) {
    return
  }
  return axios
    .get(`/images/${id}/flux_by_position`, { params }, { timeout: 300000 })
    .then((res) => res.data);
};

export const spectrumLinesByPosition = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id, x, y } = params
  if (!id || !x || !y) {
    return
  }

  return axios.get(`/images/${id}/spectrum_lines_by_position`, { params: { x, y } }).then(res => res.data)
}


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

// export const getHudList = (id) =>
//   axios.get(`/images/${id}/list_hud/`).then((res) => res.data);
export const listAllGalaxies = ({ queryKey }) => {
  const [_, params] = queryKey
  console.log("Params: ", params)
  const { pageSize, sortModel } = params

  // Fix Current page
  let page = params.page + 1

  // Parse Sort options
  let sortFields = []
  if (sortModel !== undefined && sortModel.length > 0) {
    sortModel.forEach((e) => {
      if (e.sort === 'asc') {
        sortFields.push(e.field);
      } else {
        sortFields.push(`-${e.field}`);
      }
    });
  }
  let ordering = sortFields.length !== 0 ? sortFields.join(',') : null

  return axios
    .get(`/images/`, { params: { page, pageSize, ordering } })
    .then((res) => res.data);
};

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

export const logAgeByPosition = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id, x, y } = params
  if (!id || !x || !y) {
    return
  }

  return axios.get(`/images/${id}/log_age_by_position`, { params: { x, y } }).then(res => res.data)
}

export const vecsByPosition = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id, x, y } = params
  if (!id || !x || !y) {
    return
  }

  return axios.get(`/images/${id}/vecs_by_position`, { params: { x, y } }).then(res => res.data)
}

// export const getHeader = (id) =>
//   axios.get(`/images/${id}/megacube_header`).then((res) => res.data);

// export const getDownloadInfo = (id) =>
//   axios.get(`/images/${id}/download_info`).then((res) => res.data);

export const sendEmail = (formData) =>
  axios
    .post('/contact/', formData)
    .then((res) => res)
    .catch((err) => err);
