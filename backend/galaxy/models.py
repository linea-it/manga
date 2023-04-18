from django.db import models
from django.conf import settings


class Image(models.Model):
    megacube = models.CharField(
        verbose_name='Megacube File Name',
        help_text='The name of the megacube\'s file',
        max_length=150,
        unique=True
    )
    plate = models.BigIntegerField(
        verbose_name='Plate ID',
        help_text='	Plate ID',
        null=True,
        blank=True
    )
    ifudsgn = models.CharField(
        verbose_name='IFU Design ID',
        help_text='IFU Design ID (e.g. 12701)',
        max_length=100,
        null=True,
        blank=True
    )
    plateifu = models.CharField(
        verbose_name='Plate IFU Design ID',
        help_text='Plate+ifudesign name for this object (e.g. 7443-12701)',
        max_length=100,
        unique=True
    )
    mangaid = models.CharField(
        verbose_name='MaNGA ID',
        help_text='MaNGA ID for this object (e.g. 1-114145)',
        max_length=100,
        unique=True
    )
    versdrp2 = models.CharField(
        verbose_name='DRP 2 Version',
        help_text='	Version of mangadrp used for 2d reductions',
        max_length=100,
        null=True,
        blank=True
    )
    versdrp3 = models.CharField(
        verbose_name='DRP 3 Version',
        help_text='Version of mangadrp used for 3d reductions',
        max_length=100,
        null=True,
        blank=True
    )
    verscore = models.CharField(
        verbose_name='Mangacore Version',
        help_text='Version of mangacore used for reductions',
        max_length=100,
        null=True,
        blank=True
    )
    versutil = models.CharField(
        verbose_name='Idutils Version',
        help_text='Version of idlutils used for reductions',
        max_length=100,
        null=True,
        blank=True
    )
    versprim = models.CharField(
        verbose_name='MaNGA ID',
        help_text='Version of mangapreim used for reductions',
        max_length=100,
        null=True,
        blank=True
    )
    platetyp = models.CharField(
        verbose_name='MaNGA ID',
        help_text='	Plate type (e.g. MANGA, APOGEE-2&MANGA)',
        max_length=100,
        null=True,
        blank=True
    )
    srvymode = models.CharField(
        verbose_name='Survey Mode',
        help_text='Survey mode (e.g. MANGA dither, MANGA stare, APOGEE lead)',
        max_length=100,
        null=True,
        blank=True
    )
    objra = models.FloatField(
        verbose_name='Object Right Ascension',
        help_text='Right ascension of the science object in J2000 (degrees)',
        null=True,
        blank=True
    )
    objdec = models.FloatField(
        verbose_name='Object Declination',
        help_text='Declination of the science object in J2000 (degrees)',
        null=True,
        blank=True
    )
    ifuglon = models.FloatField(
        verbose_name='IFU RA/DEC Galactic Longitude',
        help_text='Galactic longitude corresponding to IFURA/DEC (degrees)',
        null=True,
        blank=True
    )
    ifuglat = models.FloatField(
        verbose_name='IFU RA/DEC Galactic Latitude',
        help_text='Galactic latitude corresponding to IFURA/DEC (degrees)',
        null=True,
        blank=True
    )
    ifura = models.FloatField(
        verbose_name='IFU Right Ascension',
        help_text='Right ascension of this IFU in J2000 (degrees)',
        null=True,
        blank=True
    )
    ifudec = models.FloatField(
        verbose_name='IFU Declination',
        help_text='Declination of this IFU in J2000 (degrees)',
        null=True,
        blank=True
    )
    ebvgal = models.FloatField(
        verbose_name='Galactic E(B-V)',
        help_text='E(B-V) value from SDSS dust routine for this IFUGLON, IFUGLAT',
        null=True,
        blank=True
    )
    nexp = models.BigIntegerField(
        verbose_name='Exposures',
        help_text='Number of science exposures combined',
        null=True,
        blank=True
    )
    exptime = models.FloatField(
        verbose_name='Exposures Time',
        help_text='Total exposure time (seconds)',
        null=True,
        blank=True
    )
    drp3qual = models.BigIntegerField(
        verbose_name='Quality Bitmask',
        help_text='Quality bitmask',
        null=True,
        blank=True
    )
    bluesn2 = models.FloatField(
        verbose_name='Blue (S/N)²',
        help_text='Total blue (S/N)^2 across all nexp exposures',
        null=True,
        blank=True
    )
    redsn2 = models.FloatField(
        verbose_name='Red (S/N)²',
        help_text='Total red (S/N)^2 across all nexp exposures',
        null=True,
        blank=True
    )
    harname = models.CharField(
        verbose_name='Harness Name',
        help_text='IFU harness name',
        max_length=100,
        null=True,
        blank=True
    )
    frlplug = models.BigIntegerField(
        verbose_name='Frplug',
        help_text='Frplug hardware code',
        null=True,
        blank=True
    )
    cartid = models.CharField(
        verbose_name='Cartridge ID',
        help_text='Cartridge ID number',
        max_length=100,
        null=True,
        blank=True
    )
    designid = models.BigIntegerField(
        verbose_name='Design ID',
        help_text='Design ID number',
        null=True,
        blank=True
    )
    cenra = models.FloatField(
        verbose_name='Plate Center Right Ascension',
        help_text='Plate center right ascension in J2000 (degrees)',
        null=True,
        blank=True
    )
    cendec = models.FloatField(
        verbose_name='Plate Center Declination',
        help_text='Plate center declination in J2000 (degrees)',
        null=True,
        blank=True
    )
    airmsmin = models.FloatField(
        verbose_name='Minimum Airmass',
        help_text='Minimum airmass across all exposures',
        null=True,
        blank=True
    )
    airmsmed = models.FloatField(
        verbose_name='Median Airmass',
        help_text='Median airmass across all exposures',
        null=True,
        blank=True
    )
    airmsmax = models.FloatField(
        verbose_name='Maximum Airmass',
        help_text='Maximum airmass across all exposures',
        null=True,
        blank=True
    )
    seemin = models.FloatField(
        verbose_name='Best Guider Seeing',
        help_text='Best guider seeing (arcsec)',
        null=True,
        blank=True
    )
    seemed = models.FloatField(
        verbose_name='Median Guider Seeing',
        help_text='Median guider seeing (arcsec)',
        null=True,
        blank=True
    )
    seemax = models.FloatField(
        verbose_name='Worst Guider Seeing',
        help_text='Worst guider seeing (arcsec)',
        null=True,
        blank=True
    )
    transmin = models.FloatField(
        verbose_name='Worst Transparency',
        help_text='Worst transparency',
        null=True,
        blank=True
    )
    transmed = models.FloatField(
        verbose_name='Median Transparency',
        help_text='Median transparency',
        null=True,
        blank=True
    )
    transmax = models.FloatField(
        verbose_name='Best Transparency',
        help_text='Best transparency',
        null=True,
        blank=True
    )
    mjdmin = models.BigIntegerField(
        verbose_name='Minimum MJD',
        help_text='Minimum MJD across all exposures',
        null=True,
        blank=True
    )
    mjdmed = models.BigIntegerField(
        verbose_name='Median MJD',
        help_text='Median MJD across all exposures',
        null=True,
        blank=True
    )
    mjdmax = models.BigIntegerField(
        verbose_name='Maximum MJD',
        help_text='Maximum MJD across all exposures',
        null=True,
        blank=True
    )
    gfwhm = models.FloatField(
        verbose_name='FWHM g',
        help_text='Reconstructed FWHM in g-band (arcsec)',
        null=True,
        blank=True
    )
    rfwhm = models.FloatField(
        verbose_name='FWHM r',
        help_text='Reconstructed FWHM in r-band (arcsec)',
        null=True,
        blank=True
    )
    ifwhm = models.FloatField(
        verbose_name='FWHM i',
        help_text='Reconstructed FWHM in i-band (arcsec)',
        null=True,
        blank=True
    )
    zfwhm = models.FloatField(
        verbose_name='FWHM z',
        help_text='Reconstructed FWHM in z-band (arcsec)',
        null=True,
        blank=True
    )
    mngtarg1 = models.BigIntegerField(
        verbose_name='Manga-Target1',
        help_text='Manga-target1 maskbit for galaxy target catalog',
        null=True,
        blank=True
    )
    mngtarg2 = models.BigIntegerField(
        verbose_name='Manga-Target2',
        help_text='Manga-target2 maskbit for galaxy target catalog',
        null=True,
        blank=True
    )
    mngtarg3 = models.BigIntegerField(
        verbose_name='Manga-Target3',
        help_text='Manga-target3 maskbit for galaxy target catalog',
        null=True,
        blank=True
    )
    catidnum = models.BigIntegerField(
        verbose_name='Primary Target Input Catalog',
        help_text='Primary target input catalog (leading digits of mangaid)',
        null=True,
        blank=True
    )
    plttarg = models.CharField(
        verbose_name='Plate Target',
        help_text='Plate target reference file appropriate for this target',
        max_length=100,
        null=True,
        blank=True
    )
    manga_tileid = models.BigIntegerField(
        verbose_name='Tile ID',
        help_text='The ID of the tile to which this object has been allocated',
        null=True,
        blank=True
    )
    nsa_iauname = models.CharField(
        verbose_name='IAU-Style',
        help_text='IAU-style designation based on RA/Dec (NSA)',
        max_length=19,
        null=True,
        blank=True
    )
    ifudesignsize = models.BigIntegerField(
        verbose_name='Allocated IFU Size',
        help_text='The allocated IFU size (0 = "unallocated")',
        null=True,
        blank=True
    )
    ifutargetsize = models.BigIntegerField(
        verbose_name='Ideal IFU Size',
        help_text='The ideal IFU size for this object. The intended IFU size is equal to IFUTargetSize except if IFUTargetSize > 127 when it is 127, or < 19 when it is 19',
        null=True,
        blank=True
    )
    ifudesignwrongsize = models.BigIntegerField(
        verbose_name='Alternative Allocated IFU Size',
        help_text='The allocated IFU size if the intended IFU size was not available',
        null=True,
        blank=True
    )
    nsa_field = models.BigIntegerField(
        verbose_name='Field ID',
        help_text='SDSS field ID covering the target',
        null=True,
        blank=True
    )
    nsa_run = models.BigIntegerField(
        verbose_name='Run ID',
        help_text='SDSS run ID covering the target',
        null=True,
        blank=True
    )
    nsa_version = models.CharField(
        verbose_name='Version',
        help_text='Version of NSA catalogue used to select these targets',
        max_length=6,
        null=True,
        blank=True
    )
    nsa_nsaid = models.BigIntegerField(
        verbose_name='',
        help_text='',
        null=True,
        blank=True
    )
    nsa_z = models.FloatField(
        verbose_name='Heliocentric Redshift',
        help_text='Heliocentric redshift',
        null=True,
        blank=True
    )
    nsa_zdist = models.FloatField(
        verbose_name='z Distance',
        help_text='Distance estimate using peculiar velocity model of Willick et al. (1997); mulitply by c/Ho for Mpc',
        null=True,
        blank=True
    )
    # nsa_sersic_absmag = ''
    # nsa_elpetro_absmag = ''
    # nsa_elpetro_amivar = ''
    nsa_sersic_mass = models.FloatField(
        verbose_name='K-Correction Stellar Mass For Sersic Fluxes',
        help_text='Stellar mass from K-correction fit (use with caution) for Sersic fluxes (Ωm=0.3, ΩΛ=0.7, h=1)',
        null=True,
        blank=True
    )
    nsa_elpetro_mass = models.FloatField(
        verbose_name='K-Correction Stellar Mass For Elliptical Petrosian Fluxes',
        help_text='Stellar mass from K-correction fit (use with caution) for elliptical Petrosian fluxes (Ωm=0.3, ΩΛ=0.7, h=1)',
        null=True,
        blank=True
    )
    nsa_elpetro_ba = models.FloatField(
        verbose_name='Elliptical Apertures Axis Ratio',
        help_text='Axis ratio used for elliptical apertures (for this version, same as ba90)',
        null=True,
        blank=True
    )
    nsa_elpetro_phi = models.FloatField(
        verbose_name='Elliptical Apertures Position Angle',
        help_text='Position angle (east of north) used for elliptical apertures (for this version, same as ba90) (degrees)',
        null=True,
        blank=True
    )
    # nsa_extinction = ''
    nsa_petro_th50 = models.FloatField(
        verbose_name='Petrosian 50% Light',
        help_text='Azimuthally averaged SDSS-style Petrosian 50% light radius (derived from r band) (arcsec)',
        null=True,
        blank=True
    )
    # nsa_petro_flux = ''
    # nsa_petro_flux_ivar = ''
    # nsa_elpetro_flux = ''
    # nsa_elpetro_flux_ivar = ''
    nsa_sersic_ba = models.FloatField(
        verbose_name='Sersic B/A',
        help_text='Axis ratio b/a from two-dimensional, single-component Sersic fit in r-band',
        null=True,
        blank=True
    )
    nsa_sersic_n = models.FloatField(
        verbose_name='Sersic Index',
        help_text='Sersic index from two-dimensional, single-component Sersic fit in r-band',
        null=True,
        blank=True
    )
    nsa_sersic_phi = models.FloatField(
        verbose_name='Sersic Angle (E of N)',
        help_text='Angle (E of N) of major axis in two-dimensional, single-component Sersic fit in r-band (degrees)',
        null=True,
        blank=True
    )
    nsa_sersic_th50 = models.FloatField(
        verbose_name='Sersic 50% Light',
        help_text='50% light radius of two-dimensional, single-component Sersic fit to r-band (arcsec)',
        null=True,
        blank=True
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

    path = models.FilePathField(
        verbose_name='Path',
        null=True,
        blank=True,
        default=None,
        help_text='Complete Path to original file.'
    )

    folder_name = models.FilePathField(
        verbose_name='Folder',
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

    # nsa_sersic_flux = ''
    # nsa_sersic_flux_ivar= ''

    def __str__(self):
        return str(self.pk)


# # List of galaxies, created by the user:
# class List(models.Model):
#     id_owner = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         verbose_name='Owner',
#         on_delete=models.CASCADE,
#     )
#     name = models.CharField(max_length=200)
#     objects_qty = models.IntegerField(default=0)
#     creation_date = models.DateTimeField('date published')

#     def __str__(self):
#         return str(self.pk)


# # Key-value association, many-to-many, between the galaxies and lists:
# class ListImage(models.Model):
#     class Meta:
#         db_table = 'galaxy_list_image'

#     id_image = models.ForeignKey(
#         Image,
#         verbose_name='Image',
#         on_delete=models.CASCADE,
#     )
#     id_list = models.ForeignKey(
#         List,
#         verbose_name='List',
#         on_delete=models.CASCADE,
#     )
