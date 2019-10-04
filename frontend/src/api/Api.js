import axios from 'axios';

axios.defaults.baseURL = 'http://localhost/api';


export const getFluxByPosition = ({ x, y, megacube }) =>
  axios.get(`/flux_by_position?megacube=${megacube}.fits&x=${x}&y=${y}`)
    .then(res => res.data)

export const getSpaxelFitByPosition = ({ x, y, megacube }) =>
  axios.get(`/spaxel_fit_by_position?megacube=${megacube}.fits&x=${x}&y=${y}`)
    .then(res => res.data)

export const getImageHeatmap = ({ megacube, hud }) =>
  axios.get(`/image_heatmap?megacube=${megacube}.fits&hud=${hud}`)
    .then(res => res.data)

export const getHudList = ({ megacube }) =>
  axios.get(`/list_hud?megacube=${megacube}.fits`)
    .then(res => res.data.hud)
