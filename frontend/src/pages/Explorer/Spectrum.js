import React, {useLayoutEffect, useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardMedia, CardContent, Grid, CircularProgress, Typography, Box } from '@material-ui/core';
// import styles from './styles';
import { useQuery } from 'react-query'
import { spectrumLinesByPosition } from '../../services/api';
import styles from './styles';

function SpectrumCard(props) {
    const {id, x, y } = props

     
}

export default SpectrumCard;    