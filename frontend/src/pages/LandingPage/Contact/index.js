import React, { useRef, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Snackbar,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import EmailIcon from '@material-ui/icons/Email';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './styles';
import { sendEmail } from '../../../services/api';

function Contact() {
  const classes = styles();

  const formRef = useRef();

  const recaptchaKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  const [open, setOpen] = useState('');
  const [submitEnabled, setSubmitEnabled] = useState(
    !recaptchaKey
  );

  const handleClose = () => {
    setOpen('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitEnabled) {
      const formData = {
        name: formRef.current.name.value,
        subject: formRef.current.subject.value,
        from: formRef.current.from.value,
        message: formRef.current.message.value,
      };

      sendEmail(formData).then((res) => {
        if (res.status === 200) {
          setOpen('success');
          formRef.current.reset();
        } else if (res.status === 403) {
          setOpen('unauthorized');
        } else {
          setOpen('unexpected');
        }
      });
    }
  };

  const onRecaptchaChange = (humanKey) => {
    if (humanKey) {
      setSubmitEnabled(true);
    }
  };

  return (
    <div className={classes.initContainer}>
      <Container>
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Home
            </Link>
            <Typography color="textPrimary">Contact</Typography>
          </Breadcrumbs>
          <Grid item xs={6} className={classes.grid}>
            <Typography variant="h3" align="center" color="textPrimary">
              Contact
            </Typography>
            <p>
              <span>
                If you have any problems related to the usage of the
                applications,
                <Link href="/tutorials" variant="body2">
                  &nbsp;click here&nbsp;
                </Link>
                to be redirected to the tutorials page. Or if you still have
                questions, suggestions or complaints, you can contact us using
                the form below.
              </span>
            </p>
            <br />
            <form ref={formRef} autoComplete="off" onSubmit={handleSubmit}>
              <div className={classes.textFields}>
                <TextField
                  required
                  id="name"
                  type="text"
                  variant="outlined"
                  label="Name"
                  placeholder="Name"
                  fullWidth
                  size="small"
                />
              </div>

              <div className={classes.textFields}>
                <TextField
                  required
                  id="from"
                  type="email"
                  variant="outlined"
                  label="Email"
                  placeholder="Email"
                  fullWidth
                  size="small"
                />
              </div>

              <div className={classes.textFields}>
                <TextField
                  required
                  id="subject"
                  type="text"
                  variant="outlined"
                  label="Subject"
                  placeholder="Subject"
                  fullWidth
                  size="small"
                />
              </div>

              <div className={classes.textFields}>
                <TextField
                  required
                  id="message"
                  type="text"
                  variant="outlined"
                  multiline
                  rows="8"
                  rowsMax="8"
                  fullWidth
                  size="small"
                  label="Message"
                  placeholder="Message"
                />
              </div>
              {recaptchaKey ? (
                <ReCAPTCHA
                  sitekey={recaptchaKey}
                  onChange={onRecaptchaChange}
                />
              ) : null}
              <Grid container alignItems="flex-end">
                <Grid item xs={10} />
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disableElevation
                    disabled={!submitEnabled}
                  >
                    <EmailIcon />
                    &nbsp;Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open === 'success'}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          <AlertTitle>Success</AlertTitle>
          <p>
            Your message was sent! A ticket was opened on our issue tracking
            system and you`&apos;`ll receive a feedback when it gets approved.
          </p>
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open === 'unauthorized'}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning">
          <AlertTitle>Unauthorized</AlertTitle>
          <p>
            <span>
              Sorry, you have to be authenticated in this application to send a
              message. In case you still need to contact us,{' '}
            </span>
            <Link
              href="https://www.linea.org.br/6-faleconosco/"
              target="_blank"
            >
              click here
            </Link>
            <span> to go to the `&ldquo;`Contact Us`&rdquo;` page on our website</span>
          </p>
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open === 'unexpected'}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          <AlertTitle>Unexpected Error</AlertTitle>
          <p>
            <span>
              Sorry, an unexpected error has occurred. Could you please try
              again? If it still didn`&apos;`t work, you can{' '}
            </span>
            <Link
              href="https://www.linea.org.br/6-faleconosco/"
              target="_blank"
            >
              click here
            </Link>
            <span> to go to the  `&ldquo;`Contact Us`&rdquo;` page on our website.</span>
          </p>
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Contact;
