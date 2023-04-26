#!/usr/bin/python
###########################################################################
# Author: Rogerio Riffel                                                  #
# This is an adaptation of fit_scrutinizer written by Daniel Ruschel Duta #
# and avaliable at: https://bitbucket.org/danielrd6/ifscube/              #
#                                                                         #
###########################################################################



import argparse
import tkinter as tk

# third party
import matplotlib
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.backends.backend_tkagg import NavigationToolbar2Tk
from matplotlib.figure import Figure
import numpy as np
from numpy import ma
from mpl_toolkits.axes_grid1 import make_axes_locatable
import re
import matplotlib.pyplot as plt
# local
import sys

from astropy.io import fits as pf
class mclass:

    def __init__(self, window, megacube='None',PopBins='PoPBins',flxNorm='FLXOBS',flxSyn='FLXSYN',PoPVecsL='PoPVecsL',PoPVecsM='PoPVecsM'):

        self.cube_header = pf.getheader(megacube,PopBins)
        self.cube_data = pf.getdata(megacube,PopBins)
#        self.cube_data = pf.getdata(megacube,0)
        self.l0=pf.getheader(megacube,flxNorm)['CRVAL3']
        self.dl=pf.getheader(megacube,flxNorm)['CD3_3']

        self.data_cube_Lfrac=pf.getdata(megacube,PoPVecsL)
        self.data_cube_Mfrac=pf.getdata(megacube,PoPVecsM)


        self.data_cube_flux=pf.getdata(megacube,flxNorm)
        self.data_cube_synt=pf.getdata(megacube,flxSyn)
        (self.size,self.ypix,self.xpix) = np.shape(self.data_cube_flux)
        self.lamb=np.arange(self.l0,(self.dl*self.size+self.l0),self.dl)
        self.z,self.y,self.x=np.shape(self.cube_data)
        
        self.aux=pf.getdata(megacube,'BaseAgeMetal')
        self.popage=self.aux[:,0]
        self.popZ=self.aux[:,1]
        self.Zs = np.unique(self.popZ)[np.unique(self.popZ) != 0]

        
        self.vecs=0
        for i in range(0,np.shape(self.cube_data)[0],1):
           if 'light' in self.cube_header['DATA'+str(i)]: self.vecs=self.vecs+1

        
        
        
        
        
        self.window = window
        self.buttonPlot = tk.Button(
            window, text='Image plot', command=self.plot)
        self.buttonFollow = tk.Button(
            window, text='Follow mouse', command=self.follow)
        self.buttonSinglePlot = tk.Button(
            window, text='Plot on click', command=self.singleplot)

        self.text = tk.Text(
            window, bg='white', height=10, width=80, font=('Fixedsys', 12))

        s_map = tk.Listbox(window, selectmode='single', exportselection=0,bg='yellow')
        l_component = tk.Listbox(window, selectmode='single', exportselection=0)
        for i in range(0,self.z,1):
            s_map.insert('end',self.cube_header['DATA'+str(i)])


        self.fig = Figure(figsize=(6, 6))
        self.fitplot = Figure(figsize=(12, 3))
        self.hists = Figure(figsize=(12, 3))
        #self.ages = Figure(figsize=(4, 3))
        #self.agesZ = Figure(figsize=(4, 3))
        #self.Vecs_hist = Figure(figsize=(4, 3))
        self.ax1 = self.fig.add_subplot(111)
        self.ax2 = self.fitplot.add_subplot(111)
        self.ax3 = self.hists.add_subplot(121)
        self.ax4 = self.hists.add_subplot(122)

        #self.ax3 = self.ages.add_subplot(111)
       # self.ax4 = self.agesZ.add_subplot(111)
        #self.ax5 = self.hists.add_subplot(111)
        
        div = make_axes_locatable(self.ax1)
        self.cax = div.append_axes('right', size='5%', pad=0)
        self.cax.set_xticks([])
        self.cax.set_yticks([])

        canvas = FigureCanvasTkAgg(self.fig, master=self.window)
        canvas2 = FigureCanvasTkAgg(self.fitplot, master=self.window)
        canvas3 = FigureCanvasTkAgg(self.hists, master=self.window)
#        canvas3 = FigureCanvasTkAgg(self.ages, master=self.window)
#        canvas4 = FigureCanvasTkAgg(self.agesZ, master=self.window)
#        canvas5 = FigureCanvasTkAgg(self.Vecs_hist, master=self.window)

        canvas.get_tk_widget()\
            .grid(row=0, column=0, rowspan=6, columnspan=6)
        canvas2.get_tk_widget()\
            .grid(row=0, column=7, rowspan=3, columnspan=6)

        canvas3.get_tk_widget()\
            .grid(row=3, column=7, rowspan=3, columnspan=6)

#        canvas4.get_tk_widget()\
#            .grid(row=3, column=9, rowspan=3, columnspan=2)

#        canvas5.get_tk_widget()\
#            .grid(row=3, column=9, rowspan=3, columnspan=3)


        tb_frame = tk.Frame(window)
        tb_frame.grid(row=7, column=0, columnspan=6, sticky='W')
        toolbar = NavigationToolbar2Tk(canvas, tb_frame)
        toolbar.update()

        other_tb_frame = tk.Frame(window)
        other_tb_frame.grid(row=8, column=7, columnspan=12, sticky='W')
        other_toolbar = NavigationToolbar2Tk(canvas2, other_tb_frame)
        other_toolbar.update()

        self.buttonPlot.grid(row=8, column=0, sticky='W')
        self.buttonFollow.grid(row=9, column=0, sticky='W')
        self.buttonSinglePlot.grid(row=10, column=0, sticky='W')
        s_map.grid(row=8, column=1, rowspan=4)

        self.text.grid(row=9, column=7, rowspan=4)

        self.s_map = s_map

        canvas.draw()

        self.canvas = canvas
        self.canvas2 = canvas2
        self.canvas3 = canvas3

    def singleplot(self):

        try:
            self.canvas.mpl_disconnect(self.connect_id)
        except:
            pass

        self.connect_id = self.canvas.mpl_connect(
            'button_press_event', self.onclick)

    def follow(self):

        try:
            self.canvas.mpl_disconnect(self.connect_id)
        except:
            pass

        self.connect_id = self.canvas.mpl_connect(
            'motion_notify_event', self.onclick)

    def getim(self):
        cube_data=self.cube_data
        cm = 'viridis'
        # ncomps = self.n_components
#        npars = self.n_parameters

        par = self.s_map.curselection()[0]
        d = self.cube_data[par,:,:]
        t = self.cube_header['DATA'+str(par)]

        return d, cm, t

    def plot(self, contrast=1):

        a = self.ax1
        a.cla()
        self.cax.cla()
        d,cm,t=self.getim()
        a.set_title(t)

        im = a.pcolormesh(d, cmap=cm)
        
        matplotlib.colorbar.Colorbar(self.cax, im)

        a.set_aspect('equal', 'datalim')

        self.canvas.draw()

    def onclick(self, event):

        try:
            i, j = [int(np.floor(x) + 0.5) for x in (event.xdata, event.ydata)]
            if np.any(np.array([i, j]) < 0):
                self.text.delete('1.0', 'end')
                self.text.insert('insert', 'Index Error!')
                return
        except AttributeError:
            self.text.delete('1.0', 'end')
            self.text.insert('insert', 'You clicked outside the plot!')
            return

        self.text.delete('1.0', 'end')

        a = self.ax2
        a.cla()


        self.text.insert('insert', ('Best fit for Spaxel x= {:2} and y= {:2}\n').format(i,j))
        self.text.insert('insert', '{:10} {:10} {:10} {:10}\n'.format('  Age','  Z','Lfrac','Mfrac'))



        try:
            self.flx=self.data_cube_flux[:,j,i]
            self.synt=self.data_cube_synt[:,j,i]

            self.lfrac=self.data_cube_Lfrac[:,j,i]
            self.mfrac=self.data_cube_Mfrac[:,j,i]


            a.plot(self.lamb,self.flx,color='blue')
            a.plot(self.lamb,self.synt,color='red')
            s=[]
            for u in range(self.z+1,len(self.cube_header)):
              try:
                   ssp,t,met=re.split(',',self.cube_header['DATA'+str(u)])
                   s.append((t,met))
              except: ' '
            for l in range(0,len(s)):
                   self.text.insert('insert','{:10}'.format(s[l][0]))
                   self.text.insert('insert', '{:10}'.format(s[l][1]))
                   try:
                     self.text.insert('insert','{:8.2f}'.format(self.lfrac[l]))
                     self.text.insert('insert','{:8.2f}'.format(self.mfrac[l]))
                   except: ' '
                   self.text.insert('insert', '\n')

        except IndexError:
            self.text.insert('insert', 'Index Error!')

        self.canvas2.draw()
        
        b = self.ax3
        b.cla()


        xlim=np.log10([1e5,20e9])  # do not change)
        ylim=[0,100] # do not change

        ############## Making log scale in the x axis ###############

        b.set_xlim(xlim)
        #bb.set_xscale('log')
        b.set_ylim(ylim)
        b.set_xlabel('log(Age)')
        b.set_ylabel('%')
#        b = self.ax3
#        b.cla()
#        plt.setp(b.get_xticklabels(), visible=True)
#        plt.setp(b.get_xminorticklabels(), visible=True)
#        plt.setp(b.get_yticklabels(), visible=True)
#        plt.setp(b.get_yminorticklabels(), visible=True)
#        b.get_xaxis().set_ticks([])
#        b.get_yaxis().set_ticks([])

        self.summedpopx=[]
        self.summedpopxTemp=[]
        self.summedpopm=[]
        self.summedpopmTemp=[]
        self.popx=self.data_cube_Lfrac[:,j,i]
        self.popm=self.data_cube_Mfrac[:,j,i]

        for z in self.Zs:
            if(len(self.popZ[self.popZ==z]) ==0):
                print('Metallicity',z,' is not in the base, I hope you know wath you are doing!')
            self.summedpopxTemp.append(self.popx[self.popZ==z])
            self.summedpopxTemp2=np.column_stack(self.summedpopxTemp)
            self.summedpopmTemp.append(self.popm[self.popZ==z])
            self.summedpopmTemp2=np.column_stack(self.summedpopmTemp)

        for ind in range(0,len(self.summedpopxTemp2)):
              self.summedpopx=np.append(self.summedpopx,sum(self.summedpopxTemp2[ind]))
              self.summedpopm=np.append(self.summedpopm,sum(self.summedpopmTemp2[ind]))

        self.summedpopages=self.popage[self.popZ==self.Zs[0]]
        b.bar(np.log10(self.summedpopages),self.summedpopx,width=0.8,align='center',color='None',edgecolor='blue',label='$\Sigma x_j$')
        b.bar(np.log10(self.summedpopages),self.summedpopm,width=0.2,align='center',color='None',edgecolor='red',label=r'$\Sigma\mu_j$',ls='dotted')
        b.legend(loc=0,frameon=False,ncol=1,prop={'size':12})

        self.canvas3.draw()

        c = self.ax4
        c.cla()
        
        #plt.setp(c.get_yticklabels(), visible=False)
        c.set_xlabel('Vecs')
        c.set_ylim(0,100)
        for k in np.arange(self.vecs+1):
           c.bar(k,self.cube_data[k,j,i],alpha=0.5)
           c.text(k,50,self.cube_header['DATA'+str(k)],rotation=90,fontsize=9,color='black')

        self.canvas3.draw()

if __name__ == '__main__':
        megacube=sys.argv[1]
        window = tk.Tk()
        window.title('Megacube Fit Analyser')
        start = mclass(window, megacube=megacube)
        window.mainloop()
