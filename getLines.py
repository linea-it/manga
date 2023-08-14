import numpy as np
import scipy.interpolate as sp
from astropy.io import fits as pf
import matplotlib.pyplot as plt

megacube = 'manga-9894-3701-MEGACUBE.fits'

# se fizeres um pf.info(megacube) vais ver onde estao cada uma das entradas do megacube
# Veras que tem varias entradas, uma eh PopBins nela tem toda a parte da sintese.

pf.getheader(megacube,'PopBins')

#Nas entradas 30 e 31 tem os dados de sigma e velocidade
#DATA30  = 'Sigma_star'         / Stellar dispersion (see starlight manual)      
#DATA31  = 'vrot_star'          / Stellar rotation (see starlight manual)  

Sigma_star=pf.getdata(megacube,'PopBins')[30] # te da o array com sigma estelar
vrot_star=pf.getdata(megacube,'PopBins')[31] # te da o array com velocidade de rotacao estelar

# Agora vamos para o gas
pf.info(megacube) 
# da entrada 35 em diante eh o gas e FLUX_M eh o fluxo modelado, no nosso caso por gaussianas.
# na entrada PARNAMES tens os nomes dos parametros...do ajuste.

pf.getdata(megacube,'PARNAMES')
#FITS_rec([('hb', 'A'), ('hb', 'v'), ('hb', 's'), ('o3_4959', 'A'),
#          ('o3_4959', 'v'), ('o3_4959', 's'), ('o3_5007', 'A'),
#          ('o3_5007', 'v'), ('o3_5007', 's'), ('He1_5876', 'A'),
#          ('He1_5876', 'v'), ('He1_5876', 's'), ('o1_6300', 'A'),
#          ('o1_6300', 'v'), ('o1_6300', 's'), ('n2_6548', 'A'),
#          ('n2_6548', 'v'), ('n2_6548', 's'), ('ha', 'A'), ('ha', 'v'),
#          ('ha', 's'), ('n2_6583', 'A'), ('n2_6583', 'v'),
#          ('n2_6583', 's'), ('s2_6716', 'A'), ('s2_6716', 'v'),
#          ('s2_6716', 's'), ('s2_6731', 'A'), ('s2_6731', 'v'),
#          ('s2_6731', 's')],
#         dtype=(numpy.record, [('component', 'S8'), ('parameter', 'S1')]))

# isso mostra que os dados esta empacotados em 3 slices e no FLUX_M tens Fluxo, vel e sigma para cada linha e no SOLUTION tens a Amplitude ao inves do fluxo (no flux jah tem a integral sob a linha)

# digamos que queres pegar o fluxo das 4 linas com # pf.getdata(megacube,'PARNAMES')[18] tu vais ver que o fluxo (A) da linha Ha esta na entrada 18. Logo

# Fluxos
cube=pf.open(megacube) 
hb=cube[43].data[0] 
o3_5007=cube[43].data[6]
ha=cube[43].data[18] 
n2_6548=cube[43].data[15]


# EW se deres um shape(pf.getdata(megacube,'EQW_M')) vais ver que tem 10 entradas, uma para cada linha (EQW_M eh a entrada 44, logo)
cube=pf.open(megacube) 
hb=cube[44].data[0] 
o3_5007=cube[44].data[2]
ha=cube[44].data[7] 
n2_6548=cube[43].data[6]

# Ai eh so organizar como tu precisa, por spaxel ou algo assim....

