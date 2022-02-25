
export const useRenderListFooter = ()=> {

  return (values: { canRender: boolean, render: ()=> JSX.Element }[])=> {
    for(let v of values) {
      if (v.canRender) {
        return v.render();
      }
    }
  }
}
