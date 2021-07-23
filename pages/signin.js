import { connect } from "react-redux";
import Signin from "../components/Signin";

const SigninPage = (props) => <Signin {...props} />;

export default connect((state) => state)(SigninPage);
