from django.db import models
from django.conf import settings


class Image(models.Model):
    megacube = models.CharField(
        verbose_name='Megacube File Name',
        help_text='The name of the megacube\'s file',
        max_length=150,
        unique=True
    )
    plateifu = models.CharField(
        verbose_name='Plate IFU Design ID',
        help_text='Plate+ifudesign name for this object (e.g. 7443-12701)',
        max_length=100,
        unique=True
    )
    ned_name= models.CharField(
        verbose_name='Common Name',
        max_length=100,
        default=None
    )
    mangaid = models.CharField(
        verbose_name='MaNGA ID',
        help_text='MaNGA ID for this object (e.g. 1-114145)',
        max_length=100,
        unique=True
    )
    objra = models.FloatField(
        verbose_name='RA',
        default=0
    )
    objdec = models.FloatField(
        verbose_name='Dec',
        default=0
    )    
    # Flag que indica se o Objeto tem arquivo bz2 extra para downlaod
    # O arquivo extra possui uma tributo a mais comp_larga.
    had_bcomp = models.BooleanField(
        verbose_name='Broad component',
        default=False,
        help_text='Indicates whether the object has an extra bz2 file containing the Broad component attribute. when true, it affects the download function, which makes 2 files available.'
    )    
    
    # Flag que indica se o processo extract_image_parts foi executado para este objeto.
    had_parts_extracted = models.BooleanField(
        verbose_name='Extracted',
        default=False,
        help_text='Indicates whether the process of extracting parts of the image was performed for this object.'
    )
    
    compression = models.CharField(
        verbose_name='Compression',
        max_length=10,
        blank=True,
        null=True,
        default='.tar.bz2'
    )

    compressed_size = models.IntegerField(
        verbose_name='Compressed Size',
        null=True,
        blank=True,
        default=0
    )

    path = models.CharField(
        verbose_name='Path',
        max_length=1024,
        null=True,
        blank=True,
        default=None,
        help_text='Complete Path to original file.'
    )
    
    bcomp_path = models.CharField(
        verbose_name='Bcomp Path',
        max_length=1024,
        null=True,
        blank=True,
        default=None,
        help_text='Complete Path to extra bz2 file contain comp_larga ex: manga-xxx-MEGACUBE-BComp.fits.tar.bz2.'
    )

    folder_name = models.CharField(
        verbose_name='Folder',
        max_length=150,
        null=True,
        blank=True,
        default=None,
        help_text='Folder Name in megacube_parts'
    )
    
    size = models.IntegerField(
        verbose_name='Size',
        null=True,
        blank=True,
        default=0,
        help_text='Size of fits file uncompressed'
    )

    fcfc1_50 = models.FloatField(
        verbose_name='FCFC1.50',
        null=True, blank=True, default=None
    )
    
    xyy_light = models.FloatField(
        verbose_name='xyy_light',
        null=True, blank=True, default=None
    )

    xyo_light = models.FloatField(
        verbose_name='xyo_light',
        null=True, blank=True, default=None
    )

    xiy_light = models.FloatField(
        verbose_name='xiy_light',
        null=True, blank=True, default=None
    )

    xii_light = models.FloatField(
        verbose_name='xii_light',
        null=True, blank=True, default=None
    )

    xio_light = models.FloatField(
        verbose_name='xio_light',
        null=True, blank=True, default=None
    )

    xo_light = models.FloatField(
        verbose_name='xo_light',
        null=True, blank=True, default=None
    )    

    xyy_mass = models.FloatField(
        verbose_name='xyy_mass',
        null=True, blank=True, default=None
    ) 

    xyo_mass = models.FloatField(
        verbose_name='xyo_mass',
        null=True, blank=True, default=None
    ) 

    xiy_mass = models.FloatField(
        verbose_name='xiy_mass',
        null=True, blank=True, default=None
    ) 

    xii_mass = models.FloatField(
        verbose_name='xii_mass',
        null=True, blank=True, default=None
    ) 

    xio_mass = models.FloatField(
        verbose_name='xio_mass',
        null=True, blank=True, default=None
    )

    xo_mass = models.FloatField(
        verbose_name='xo_mass',
        null=True, blank=True, default=None
    )

    sfr_1 = models.FloatField(
        verbose_name='SFR_1',
        null=True, blank=True, default=None
    )
    
    sfr_5 = models.FloatField(
        verbose_name='SFR_5',
        null=True, blank=True, default=None
    )    

    sfr_10 = models.FloatField(
        verbose_name='SFR_10',
        null=True, blank=True, default=None
    )    

    sfr_14 = models.FloatField(
        verbose_name='SFR_14',
        null=True, blank=True, default=None
    )    

    sfr_20 = models.FloatField(
        verbose_name='SFR_20',
        null=True, blank=True, default=None
    )    

    sfr_30 = models.FloatField(
        verbose_name='SFR_30',
        null=True, blank=True, default=None
    )    

    sfr_56 = models.FloatField(
        verbose_name='SFR_56',
        null=True, blank=True, default=None
    )    

    sfr_100 = models.FloatField(
        verbose_name='SFR_100',
        null=True, blank=True, default=None
    )    

    sfr_200 = models.FloatField(
        verbose_name='SFR_200',
        null=True, blank=True, default=None
    )    

    av_star = models.FloatField(
        verbose_name='Av_star',
        null=True, blank=True, default=None
    )    

    mage_l = models.FloatField(
        verbose_name='Mage_L',
        null=True, blank=True, default=None
    )    

    mage_m = models.FloatField(
        verbose_name='Mage_M',
        null=True, blank=True, default=None
    )    

    mz_l = models.FloatField(
        verbose_name='MZ_L',
        null=True, blank=True, default=None
    )    

    mz_m = models.FloatField(
        verbose_name='MZ_M',
        null=True, blank=True, default=None
    )    

    mstar = models.FloatField(
        verbose_name='Mstar',
        null=True, blank=True, default=None
    )    

    sigma_star = models.FloatField(
        verbose_name='Sigma_star',
        null=True, blank=True, default=None
    )    

    vrot_star = models.FloatField(
        verbose_name='vrot_star',
        null=True, blank=True, default=None
    )    

    f_hb = models.FloatField(
        verbose_name='f(hb)',
        null=True, blank=True, default=None
    )  

    f_o3_4959 = models.FloatField(
        verbose_name='f(o3_4959)',
        null=True, blank=True, default=None
    )  

    f_o3_5007 = models.FloatField(
        verbose_name='f(o3_5007)',
        null=True, blank=True, default=None
    )  

    f_he1_5876 = models.FloatField(
        verbose_name='f(He1_5876)',
        null=True, blank=True, default=None
    )  

    f_o1_6300 = models.FloatField(
        verbose_name='f(o1_6300)',
        null=True, blank=True, default=None
    )  

    f_n2_6548 = models.FloatField(
        verbose_name='f(n2_6548)',
        null=True, blank=True, default=None
    )

    f_ha = models.FloatField(
        verbose_name='f(ha)',
        null=True, blank=True, default=None
    )

    f_n2_6583 = models.FloatField(
        verbose_name='f(n2_6583)',
        null=True, blank=True, default=None
    )

    f_s2_6716 = models.FloatField(
        verbose_name='f(s2_6716)',
        null=True, blank=True, default=None
    )

    f_s2_6731 = models.FloatField(
        verbose_name='f(s2_6731)',
        null=True, blank=True, default=None
    )

    eqw_hb = models.FloatField(
        verbose_name='eqw(hb)',
        null=True, blank=True, default=None
    )

    eqw_o3_4959 = models.FloatField(
        verbose_name='eqw(o3_4959)',
        null=True, blank=True, default=None
    )         

    eqw_o3_5007 = models.FloatField(
        verbose_name='eqw(o3_5007)',
        null=True, blank=True, default=None
    )

    eqw_he1_5876 = models.FloatField(
        verbose_name='eqw(He1_5876)',
        null=True, blank=True, default=None
    )

    eqw_o1_6300 = models.FloatField(
        verbose_name='eqw(o1_6300)',
        null=True, blank=True, default=None
    )

    eqw_n2_6548 = models.FloatField(
        verbose_name='eqw(n2_6548)',
        null=True, blank=True, default=None
    )

    eqw_ha = models.FloatField(
        verbose_name='eqw(ha)',
        null=True, blank=True, default=None
    )

    eqw_n2_6583 = models.FloatField(
        verbose_name='eqw(n2_6583)',
        null=True, blank=True, default=None
    )
    
    eqw_s2_6716 = models.FloatField(
        verbose_name='eqw(s2_6716)',
        null=True, blank=True, default=None
    )

    eqw_s2_6731 = models.FloatField(
        verbose_name='eqw(s2_6731)',
        null=True, blank=True, default=None
    )

    v_hb = models.FloatField(
        verbose_name='v(hb)',
        null=True, blank=True, default=None
    )    

    v_o3_4959 = models.FloatField(
        verbose_name='v(o3_4959)',
        null=True, blank=True, default=None
    )    

    v_o3_5007 = models.FloatField(
        verbose_name='v(o3_5007)',
        null=True, blank=True, default=None
    )

    v_he1_5876 = models.FloatField(
        verbose_name='v(He1_5876)',
        null=True, blank=True, default=None
    )     

    v_o1_6300 = models.FloatField(
        verbose_name='v(o1_6300)',
        null=True, blank=True, default=None
    )     

    v_n2_6548 = models.FloatField(
        verbose_name='v(n2_6548)',
        null=True, blank=True, default=None
    )

    v_ha = models.FloatField(
        verbose_name='v(ha)',
        null=True, blank=True, default=None
    )         

    v_n2_6583 = models.FloatField(
        verbose_name='v(n2_6583)',
        null=True, blank=True, default=None
    )         

    v_s2_6716 = models.FloatField(
        verbose_name='v(s2_6716)',
        null=True, blank=True, default=None
    ) 

    v_s2_6731 = models.FloatField(
        verbose_name='v(s2_6731)',
        null=True, blank=True, default=None
    )

    sigma_hb = models.FloatField(
        verbose_name='sigma(hb)',
        null=True, blank=True, default=None
    ) 

    sigma_o3_4959 = models.FloatField(
        verbose_name='sigma(o3_4959)',
        null=True, blank=True, default=None
    ) 

    sigma_o3_5007 = models.FloatField(
        verbose_name='sigma(o3_5007)',
        null=True, blank=True, default=None
    ) 

    sigma_he1_5876 = models.FloatField(
        verbose_name='sigma(He1_5876)',
        null=True, blank=True, default=None
    ) 

    sigma_o1_6300 = models.FloatField(
        verbose_name='sigma(o1_6300)',
        null=True, blank=True, default=None
    ) 

    sigma_n2_6548 = models.FloatField(
        verbose_name='sigma(n2_6548)',
        null=True, blank=True, default=None
    ) 

    sigma_ha = models.FloatField(
        verbose_name='sigma(ha)',
        null=True, blank=True, default=None
    ) 

    sigma_n2_6583 = models.FloatField(
        verbose_name='sigma(n2_6583)',
        null=True, blank=True, default=None
    ) 

    sigma_s2_6716 = models.FloatField(
        verbose_name='sigma(s2_6716)',
        null=True, blank=True, default=None
    ) 

    sigma_s2_6731 = models.FloatField(
        verbose_name='sigma(s2_6731)',
        null=True, blank=True, default=None
    ) 

    def __str__(self):
        return str(self.pk)
