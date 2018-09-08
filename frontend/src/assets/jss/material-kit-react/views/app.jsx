import { container } from "assets/jss/material-kit-react.jsx";
// import { blueLight } from "assets/jss/material-kit-react.jsx";
// import { aquaLight } from "assets/jss/material-kit-react.jsx";
// import { greenLight } from "assets/jss/material-kit-react.jsx";
// import { greenMedium } from "assets/jss/material-kit-react.jsx";
import { greenDark } from "assets/jss/material-kit-react.jsx";

const appStyle = {
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
  list: {
    display: 'flex',
  },
  listItem: {
    margin: 0,
    padding: 0
  },
  navLink: {
    margin: "0 5px",
    padding: "12px 15px"
  },
  link: {
    color: "white",
    '&:hover': {
      color: greenDark,
    },     
    '&:focus': {
      color: greenDark,
    }, 
  },
  icons: {
    margin: "0px 6px -7px 0"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  container: {
    zIndex: "1",
    minHeight: "75vh",
    marginTop: 160,
    padding: 20,
    ...container
  },
};

export default appStyle;
