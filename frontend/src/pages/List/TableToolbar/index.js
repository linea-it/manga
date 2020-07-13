import React, { useState } from 'react';
import {
  ButtonGroup,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Card,
  CardHeader,
  CardContent,
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';

import {
  Bookmark as BookmarkIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import TransferList from '../../../components/TransferList';
import useStyles from './styles';

function TableToolbar() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [formAddOpen, setFormAddOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    public: false,
    objects: [],
    description: '',
  });

  const handleBookmarkClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleBookmarkClose = () => {
    setAnchorEl(null);
  };

  const handleAddToggle = () => {
    setFormAddOpen((prevState) => !prevState);
  };

  const handleFormChange = (item, e) => {
    // setFormValues((prevState) => ({
    //   ...prevState,
    //   [item]: e.target.value,
    // }));
  };


  return (
    <>
      <ButtonGroup variant="contained" size="small">
        <Button size="small">
          <BookmarkIcon fontSize="small" />
        </Button>
        <Button
          size="small"
          onClick={handleBookmarkClick}
        >
          <ArrowDropDownIcon fontSize="small" />
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleBookmarkClose}
      >
        <MenuItem onClick={handleBookmarkClose}>Show only bookmarked</MenuItem>
      </Menu>
      <IconButton
        edge="start"
        className={classes.addButton}
        onClick={handleAddToggle}
      >
        <AddCircleIcon />
      </IconButton>
      <IconButton edge="start" className={classes.deleteButton}>
        <DeleteIcon />
      </IconButton>


      <Dialog
        fullWidth
        maxWidth="sm"
        open={formAddOpen}
        onClose={handleAddToggle}
      >
        <Card>
          <CardHeader
            title="Add Galaxy List"
            action={(
              <IconButton onClick={handleAddToggle}>
                <CloseIcon fontSize="small" />
              </IconButton>
          )}
          />
          <CardContent>
            <form className={classes.form} noValidate>
              <FormGroup>
                <FormControl margin="dense" className={classes.formControl}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    value={formValues.name}
                    onChange={(e) => handleFormChange('name', e)}
                  />
                </FormControl>
                <FormControl margin="dense" className={classes.formControl}>
                  <TransferList />
                </FormControl>
                <FormControl margin="dense" className={classes.formControl}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.public}
                        onChange={(e) => handleFormChange('public', e)}
                        name="Public"
                        color="primary"
                        size="small"
                      />
                    )}
                    label="Public"
                  />
                </FormControl>
                <FormControl margin="dense" className={classes.formControl}>
                  <TextField
                    label="Description"
                    multiline
                    rows={5}
                    value={formValues.description}
                    variant="outlined"
                    onChange={(e) => handleFormChange('description', e)}
                  />
                </FormControl>
              </FormGroup>
            </form>
          </CardContent>
        </Card>
      </Dialog>
    </>
  );
}

export default TableToolbar;
