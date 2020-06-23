from django.db import models
from django.conf import settings

class Image(models.Model):

  # All properties below are taken from fits files that contain metadata of objects:
  plate = models.CharField(max_length=200)
  ifudsgn = models.CharField(max_length=200)
  plateifu = models.CharField(max_length=200)
  mangaid = models.CharField(max_length=200)
  versdrp2 = models.CharField(max_length=200)
  versdrp3 = models.CharField(max_length=200)
  verscore = models.CharField(max_length=200)
  versutil = models.CharField(max_length=200)
  versprim = models.CharField(max_length=200)
  platetyp = models.CharField(max_length=200)
  srvymode = models.CharField(max_length=200)
  objra = models.CharField(max_length=200)
  objdec = models.CharField(max_length=200)
  ifuglon = models.CharField(max_length=200)
  ifuglat = models.CharField(max_length=200)
  ifura = models.CharField(max_length=200)
  ifudec = models.CharField(max_length=200)
  ebvgal = models.CharField(max_length=200)
  nexp = models.IntegerField(default=0)
  exptime = models.CharField(max_length=200)
  drp3qual = models.IntegerField(default=0)
  bluesn2 = models.CharField(max_length=200)
  redsn2 = models.CharField(max_length=200)
  harname = models.CharField(max_length=200)
  frlplug = models.IntegerField(default=0)
  cartid = models.IntegerField(default=0)
  designid = models.IntegerField(default=0)
  cenra = models.CharField(max_length=200)
  cendec = models.CharField(max_length=200)
  airmsmin = models.CharField(max_length=200)
  airmsmed = models.CharField(max_length=200)
  airmsmax = models.CharField(max_length=200)
  seemin = models.CharField(max_length=200)
  seemed = models.CharField(max_length=200)
  seemax = models.CharField(max_length=200)
  transmin = models.CharField(max_length=200)
  transmed = models.CharField(max_length=200)
  transmax = models.CharField(max_length=200)
  mjdmin = models.IntegerField(default=0)
  mjdmed = models.IntegerField(default=0)
  mjdmax = models.IntegerField(default=0)
  gfwhm = models.CharField(max_length=200)
  rfwhm = models.CharField(max_length=200)
  ifwhm = models.CharField(max_length=200)
  zfwhm = models.CharField(max_length=200)
  mngtarg1 = models.IntegerField(default=0)
  mngtarg2 = models.IntegerField(default=0)
  mngtarg3 = models.IntegerField(default=0)
  catidnum = models.IntegerField(default=0)
  plttarg = models.CharField(max_length=200)
  manga_tileid = models.IntegerField(default=0)
  iauname = models.CharField(max_length=200)
  ifudesignsize = models.IntegerField(default=0)
  ifutargetsize = models.IntegerField(default=0)
  ifudesignwrongsize = models.IntegerField(default=0)
  field = models.IntegerField(default=0)
  run = models.IntegerField(default=0)
  nsa_version = models.CharField(max_length=200)
  nsa_id = models.IntegerField(default=0)
  nsa_redshift = models.CharField(max_length=200)
  nsa_zdist = models.CharField(max_length=200)
  nsa_mstar = models.IntegerField(default=0)
  nsa_mstar_el = models.IntegerField(default=0)
  nsa_ba = models.IntegerField(default=0)
  nsa_phi = models.IntegerField(default=0)
  nsa_petro_th50 = models.IntegerField(default=0)
  nsa_petro_th50_el = models.IntegerField(default=0)
  nsa_sersic_ba = models.IntegerField(default=0)
  nsa_sersic_n = models.IntegerField(default=0)
  nsa_sersic_phi = models.IntegerField(default=0)
  nsa_sersic_th50 = models.IntegerField(default=0)

  def __str__(self):
    return str(self.pk)

# List of galaxies, created by the user:
class List(models.Model):

  id_owner = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    verbose_name='Owner',
    on_delete=models.CASCADE,
  )
  name = models.CharField(max_length=200)
  objects_qty = models.IntegerField(default=0)
  creation_date = models.DateTimeField('date published')


  def __str__(self):
    return str(self.pk)

# Key-value association, many-to-many, between the galaxies and lists:
class ListImage(models.Model):
  class Meta:
    db_table = 'galaxy_list_image'

  id_image = models.ForeignKey(
    Image,
    verbose_name='Image',
    on_delete=models.CASCADE,
  )
  id_list = models.ForeignKey(
    List,
    verbose_name='List',
    on_delete=models.CASCADE,
  )
