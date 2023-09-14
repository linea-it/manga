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

export const getHeatmapByHdu = ({ queryKey }) => {
  const [_, params] = queryKey
  const { id, hdu } = params
  if (!id || !hdu) {
    return
  }

  return axios.get(`/images/${id}/heatmap_by_hdu`, {params:{hdu:hdu}}).then(res => res.data)
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

const parseFilters = (filterModel) => {

  const params = {}

  if (filterModel === undefined) {
    return params
  }
  // Handle Search
  if (filterModel.quickFilterValues !== undefined && filterModel.quickFilterValues?.length > 0){
    params["search"] = filterModel.quickFilterValues.join(" ")
  }
  if (filterModel.items !== undefined && filterModel.items.length > 0){
    filterModel.items.forEach((filter) => {
      const {field, operator, value} = filter
      if (value !== undefined) {
        if (["=", "equals"].indexOf(operator) > -1){
          params[field]=value
        }
        if (operator === '!='){
          params[`${field}!`]=value
        }
        if (operator === '>'){
          params[`${field}__gt`]=value
        }
        if (operator === '>='){
          params[`${field}__gte`]=value
        }
        if (operator === '<'){
          params[`${field}__lt`]=value
        }
        if (operator === '<='){
          params[`${field}__lte`]=value
        } 
        if (operator === 'contains'){
          params[`${field}__icontains`]=value
        }
        if (operator === 'startsWith'){
          params[`${field}__istartswith`]=value
        }
        if (operator === 'endsWith'){
          params[`${field}__iendswith`]=value
        }        
        if (operator === 'isAnyOf'){
          params[`${field}__in`]=value.join(',')
        }
        if (operator === 'is'){
          if (value.toLowerCase() === "true") {
            params[`${field}`]=true
          } 
          else if (value.toLowerCase() === "false") {
            params[`${field}`]=false
          }
        }        
      } else {
        if (operator === 'isEmpty'){
          params[`${field}__isnull`]=true
        }
        if (operator === 'isNotEmpty'){
          params[`${field}__isnull`]=false
        }
      }
    })
  }
  return params
}

export const listAllGalaxies = ({ queryKey }) => {
  const [_, params] = queryKey
  
  const { paginationModel, filterModel, sortModel } = params
  const {pageSize} = paginationModel

  console.log("FilterModel: ", filterModel)
  // Fix Current page
  let page = paginationModel.page + 1

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

  let filters = parseFilters(filterModel)

  return axios
    .get(`/images/`, { params: { page, pageSize, ordering, ...filters } })
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

export const sendEmail = (formData) =>
  axios
    .post('/contact/', formData)
    .then((res) => res)
    .catch((err) => err);
