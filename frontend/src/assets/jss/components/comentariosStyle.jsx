import { blueLight } from "assets/jss/material-kit-react.jsx";
import { aquaLight } from "assets/jss/material-kit-react.jsx";
import { greenLight } from "assets/jss/material-kit-react.jsx";
import { greenMedium } from "assets/jss/material-kit-react.jsx";
import { greenDark } from "assets/jss/material-kit-react.jsx";
import { successColor } from "assets/jss/material-kit-react.jsx";

const comentariosStyle = {
  userName: {
    color: greenMedium,
    fontWeight: "500"    
  },
  commentaryPaper: {
    padding: "10px 20px",
    width: "80%",
    margin: "20px auto",
    position: 'relative',
  },
  date: {
    fontSize: 13,
    color: "#BBBBBB"
  },
  commentsList: {
    listStyle: 'none',
    padding: 0
  },
  addComm: {
    padding: '10px 20px',
    width: "80%",
    margin: "20px auto",
  },
  commTextArea: {
    width: '100%',
    borderColor: 'transparent',
    resize: 'none',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontWeight: '300',
    color: 'rgba(60, 72, 88, 0.8)'
  },
  section: {
    padding: '10px 30px'    
  },
  LikeBtn: {
    position: 'absolute !important', 
    borderRadius: '50% !important',
    padding: '5px !important',
    minWidth: '0 !important',
    width: '36px !important',
    top: 42,
    left: -44
  },
  LikeCount: {
    left: -40,
    top: 8,
    padding: 2,
    position: 'absolute !important',
    minWidth: '0 !important',
    borderBottom: '1px solid #4caf50',    
    width: 30,
    height: 30,
    textAlign: 'center',    
  }
};

export default comentariosStyle;
