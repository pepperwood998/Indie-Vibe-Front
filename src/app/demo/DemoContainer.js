import { connect } from 'react-redux';

import DemoComponent from './DemoComponent';
import { demoOperations } from './duck';

const mapStateToProps = state => {
  const { count } = state.demo;
  return { count };
};

const mapDispatchToProps = dispatch => {
  const onIncrementClick = () => dispatch(demoOperations.incrementCount(1));
  const onDecrementClick = () => dispatch(demoOperations.decrementCount(1));

  return { onIncrementClick, onDecrementClick };
};

const DemoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DemoComponent);

export default DemoContainer;
