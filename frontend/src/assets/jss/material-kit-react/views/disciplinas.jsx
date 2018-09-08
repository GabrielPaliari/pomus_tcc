import { container } from "assets/jss/material-kit-react.jsx";
// import { blueLight } from "assets/jss/material-kit-react.jsx";
// import { aquaLight } from "assets/jss/material-kit-react.jsx";
// import { greenLight } from "assets/jss/material-kit-react.jsx";
// import { greenMedium } from "assets/jss/material-kit-react.jsx";
import { greenDark } from "assets/jss/material-kit-react.jsx";

const disciplinasStyle = {
  container: {
    ...container,
    zIndex: "2", 
    position: "relative",
    paddingTop: "10vh",
    height: "100vh",
    backgroundColor: "white",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.7)"
  },
  pageHeader: {
    minHeight: "100vh",
    height: "auto",
    display: "inherit",
    position: "relative",
    margin: "0",
    padding: "0",
    border: "0",
    alignItems: "center",
    "&:before": {
      background: "rgba(0, 0, 0, 0.5)"
    },
    "&:before,&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: '""',
      backgroundColor: greenDark,
    }
  },
  form: {
    margin: "0"
  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    textAlign: "center"
  },
  cardFooter: {
    paddingTop: "0rem",
    border: "0",
    borderRadius: "6px",
    justifyContent: "center !important"
  },
  socialLine: {
    marginTop: "1rem",
    textAlign: "center",
    padding: "0",
  },
  inputIconsColor: {
    color: "#495057",
  },
  formControl: {
    margin: "0 !important",
    paddingBottom: "0"
  },
  inputRootCustomClasses: {
    margin: "0!important"
  },
  searchIcon: {
    width: "20px",
    height: "20px",    
  },
  navBarGreen: {
    backgroundColor: "#CCCCCC",
  },
};

export default disciplinasStyle;
