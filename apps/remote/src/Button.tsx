import CoreApi from '@ca/core-api'


const Button = () => {
  console.log('From remote button<instance.name>: ', CoreApi.name)
  return <div>remote aaa button</div>
};

export default Button;