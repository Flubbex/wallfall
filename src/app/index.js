import React, { Fragment } from 'react'
import { BrowserRouter, Route, Link,NavLink, Redirect} from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'

function Item(props){
  return (<NavLink to={props.to}>
            {props.label}
          </NavLink>)
}

function flatten(children){
  return children.map((child,key)=>{
    return (<li key={key}>
              <Item label={child.name} to={'/'+child.name+'/'}/>
            </li>)
  })
}

function AppMenu(props) {
  var menucontent = flatten(props.listing.children)
  
  return (<aside className="menu">
            <p className="menu-label">
              General
            </p>
            <ul><li><Link to='/'>Frontpage</Link></li></ul>
            <p className="menu-label">
              Wallpaper Sets
            </p>
            <ul>{menucontent}</ul>
          </aside>)
}

function Home(props){
  var total = props.listing.children.reduce((acc,child)=>acc+=child.children.length,0)
  
  return (<div>
          <h2 className="is-size-2">Wallfall</h2>
            <p>
              Total of {total} wallpapers in {props.listing.children.length} sets.
            </p>
          </div>)
                
}

function Image(props){
  return (<img key={props.key} src={props.src} alt={props.alt}/>)
}

function ImageTile(props){
  return (<div className="tile">
            <figure className="image is-128x128-mobile">
                <Link to={props.to}>
                  <Image src={props.src} alt={props.alt}/>
                </Link>
            </figure> 
          </div>
         )
}

function chunkify(target,size)
{
  return Array(Math.ceil(target.length / size))
        .fill()
        .map((_, index) => index * size)
        .map(begin => target.slice(begin, begin + size))
}

function Pagination(props){
  var maxsteps = props.steps || 3,
      stepratio = Math.ceil(maxsteps/2)-1   
  
  return (<div className="pagination" role="navigation" aria-label="pagination">
            
            {props.index > 0 ? <Link to={(props.index-1).toString()} className="pagination-previous">Previous</Link>:null}
            
            {props.index < props.max ? < Link to={(props.index+1).toString()} className="pagination-next">Next page</Link>:null}
            
            <ul className="pagination-list">
            {props.index!==0
              ? ( <Fragment>
                    <li>
                      <Link to='0' 
                            className="pagination-link" 
                            aria-label={"Goto page 0"}>
                            0
                      </Link>
                    </li>
                    <li>
                      <span className="pagination-ellipsis">&hellip;</span>
                    </li>
                   </Fragment> )
              : (null) }
                    
              {new Array(maxsteps).fill(0).map((zero,index)=>
                
                index - stepratio + props.index >= 0 &&
                index - stepratio + props.index <= props.max
                
                ? (<li key={index}>
                  <NavLink className={(index-stepratio+props.index)===props.index?"pagination-link is-current":"pagination-link"}
                            aria-label={"Goto page "+(index -stepratio + props.index)} 
                            to={(index - stepratio + props.index).toString()}>
                            {index - stepratio  + props.index}
                  </NavLink>
                </li>)
                : ( null )
                )}
                
              {props.index!==props.max
              ? ( <Fragment>
                  <li>
                    <span className="pagination-ellipsis">&hellip;</span>
                  </li>
                  <li>
                    <Link to={props.max.toString()} 
                      className="pagination-link" 
                      aria-label={"Goto page "+props.max}>
                      {props.max}
                    </Link>
                  </li> 
                  </Fragment>)
              : ( null )
              }
              
            </ul>
          </div>)
}

function Paper(props,state){
  var category  = props.params.category,
      child     = props.listing.children.filter((child)=>child.name===category)[0],
      list      = child ? child.children : []
  
  if (!child)
    return (<div>
                <h3 className="is-size-4">404</h3>
                <p>
                  Unknown or missing category: <span className="is-italic">{category}</span>
                </p>
            </div>)
          
  if (list.length === 0)
    return (<div>
              <p> No papers in this collection..</p>
            </div>) 
  
  var maxtiles  = 25,
      maxwidth  = 5,
      chunkid   = props.params.page ? parseInt(props.params.page,10) : 0,
      chunks    = chunkify(list,maxtiles)
      
  if (chunkid >= chunks.length || chunkid < 0)
    return (<div>
              <p>Invalid page number, try again.</p>
            </div>) 
  
  var chunk     = chunks[chunkid],
      papers    = chunk.map((node,key)=> <ImageTile key={key} 
                                                    src={'/wallpaper/'+category+'/'+node.name} 
                                                    to={'/'+category+'/'+chunkid+'/'+node.name}
                                                    alt={node.name} 
                                                    name={node.name} />),
      
      contents  = (<Fragment>
                    <Pagination index={chunkid} max={Math.floor(list.length/maxtiles) } />
                    <div className="tile is-ancestor is-vertical">
                      {
                        chunkify(papers,maxwidth)
                        .map((tilechunk,key)=>(
                          <div key={key} className="tile is-parent">
                            {tilechunk}
                          </div>
                        ))
                      }
                    </div>
                  </Fragment>
                  )
                
  return (<div>
          <h2 className="is-size-2">{category}</h2>
            <p>
              Total of {list.length} wallpapers in set.
            </p>

            {contents}
          
        </div>)
}

function NavMenu(props){
  var menucontent = props.listing.children.map((child)=>(
    <div className="navbar-item" key={child.name}>
      <NavLink to={'/'+child.name+'/'}
        onClick={(e)=> e.target.parentNode.parentNode.parentNode.classList.toggle('is-active')}
      >{child.name}</NavLink>
    </div>
  ))
  
  return (<div className="navbar-menu">
              <div className="navbar-end">
                <div className="navbar-item has-dropdown">
                  <a className="navbar-link" 
                      onClick={(e)=> e.target.parentNode.classList.toggle('is-active')} 
                      >
                    Papers
                  </a>
                  <div className="navbar-dropdown is-dark">
                    {menucontent}
                    <hr className="navbar-divider"/>
                    <div className="navbar-item">
                      v0.2.1
                    </div>
                  </div>
                </div>
              </div>
          </div>)
}

function Hero(props){
  return (<div className="hero is-primary" id="hero" >
            <div className="hero-footer">
              <div className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                  <div className="navbar-item ">
                    <Link to="/">
                      <h1 className='is-size-1 has-text-centered is-lowercase' style={{fontFamily:'Qilla'}}>
                        Wallfall
                      </h1>
                    </Link>
                  </div>
                  
                  <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false"
                     onClick={(e)=>{e.target.classList.toggle('is-active');e.target.parentNode.parentNode.children[1].classList.toggle('is-active')}}>
                    <span aria-hidden="true" onClick={(e)=>{e.target.parentNode.classList.toggle('is-active');e.target.parentNode.parentNode.parentNode.children[1].classList.toggle('is-active')}}></span>
                    <span aria-hidden="true" onClick={(e)=>{e.target.parentNode.classList.toggle('is-active');e.target.parentNode.parentNode.parentNode.children[1].classList.toggle('is-active')}}></span>
                    <span aria-hidden="true" onClick={(e)=>{e.target.parentNode.classList.toggle('is-active');e.target.parentNode.parentNode.parentNode.children[1].classList.toggle('is-active')}}></span>
                  </a>
                </div>
                  <NavMenu listing={props.listing}/>
              </div>
            </div>
          </div>)
}

function Lightbox(props){
  return (<div className="modal is-active">
            <div className="modal-background"></div>
              <div className="modal-content">
                <div className="card is-paddingless">
                  <figure className="image">
                    <a href={'/wallpaper/'+props.params.category+'/'+props.params.name}
                          download>
                    <img src={'/wallpaper/'+props.params.category+'/'+props.params.name}
                         alt={props.params.name}/> 
                    </a>
                  </figure>
                </div>
             </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={(e)=>e.target.parentNode.classList.remove('is-active')}></button>
          </div>)
}

/* 
RedirectWithParams
by Gleb Lobastov 
https://stackoverflow.com/questions/43399740/react-router-redirect-drops-param
*/
const RedirectWithParams = ({ exact, from, push, to }) => {
   const pathTo = pathToRegexp.compile(to);
   return (
     <Route exact={exact} path={from} component={({ match: { params } }) => (
       <Redirect to={pathTo(params)} push={push} />
     )} />
   );
}

function Container (props){
  return (<Fragment>
              <Hero listing={props.listing} />
              <div className="section" style={{paddingTop:'.5rem'}}>
                <Route exact path="/" 
                      component={ ()=> ( <Home  listing={props.listing} /> )} />
                
                <Route path="/:category/:page" 
                      component={ (moreprops)=> ( <Paper params={moreprops.match.params} listing={props.listing} /> )} />
                
                <Route path="/:category/:page/:name" 
                      component={ (moreprops)=> ( <Lightbox params={moreprops.match.params} /> )} />
                
                <RedirectWithParams exact 
                      from="/:category" 
                      to="/:category/0"/>
              </div>
          </Fragment>)
}

function App(props) {
    return (<BrowserRouter basename="/wallfall">            
                <Container listing={props.listing} />
           </BrowserRouter>)
}


export default App