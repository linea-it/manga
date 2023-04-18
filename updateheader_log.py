import os
from astropy.io import fits as pf
import glob

files=glob.glob('*.fits')

failed = open('failed.log','w+')

for f in files:
       try:
           print(f,'Updating Header ...')
          
           with pf.open(f, mode="update") as file:
                 header = file["PopBins"].header
                 header.update(DATA27= ('Mstar', 'Present mass in stars (M_sun, M* from starligh)'))
                 header.update(DATA28= ('Mpross', 'Mass that has been processed in stars (~2xMstar)'))
                 file.flush()
       except:
          failed.write(f+'\n')
failed.close()

