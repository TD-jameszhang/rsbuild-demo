class CoreApi{
  constructor(){
    this.user = {}
    console.log('------Core Api constructor----------')
  }
  init({data}){
    console.log('hello core api init')
    this.user = {
      data: data
    }
  }
  get name(){
    return this.user.data.name
  }
}

const instance = new CoreApi()
export default instance