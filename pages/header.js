import { connect } from "react-redux";

import Header from "@components/Header";

const HeaderPage = (props) => <Header {...props} />;

export default connect((state) => state)(HeaderPage);
