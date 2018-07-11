import React, { Fragment } from 'react'
import { BrowserRouter, Route, Link,NavLink, Redirect} from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'

/*
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
*/

function publicUrl(){
  var path = [].slice.call(arguments).join('/')
  return ((process.env.PUBLIC_URL === '' ? '/' : process.env.PUBLIC_URL+'/')+path).replace('//','/')
}

function ImagePreview(props){
  return (<figure className="image is-128x128 is-marginless is-paddingless">
            <img alt={props.name} src={props.src} />
          </figure>)
}

function PreviewSet(props){
  var amount = props.amount || 5
  
  window.butt = props.listing
  
  return Object.keys(props.listing)
                    .map((name,key)=>(
                      <div key={key} className="card">
                        <Link to={'/'+name}>
                          <h3 className="is-size-3 has-text-centered">
                            {name}
                          </h3>
                        </Link>
                        <div className="level is-mobile" style={{overflowX:'auto'}}>
                          {Object.values(props.listing[name])
                            .slice(
                                Math.floor(Math.random()*Object.keys(props.listing[name]).length)-amount
                                )
                            .slice(0,amount)
                            .map(
                            (src,key)=>( <div className="level-item" key={key}>
                                            <ImagePreview 
                                                  name={props.name} 
                                                  src={ publicUrl('wallpaper',src) } 
                                                  />
                                          </div>)
                          )}
                        </div>
                      </div>))
}

function Home(props){
  var total = Object.values(props.listing).reduce((acc,collection)=>acc+=collection.length,0)

  return (<div className="container">
            <h2 className="is-size-2">Wallfall</h2>
              <p>
                Total of {total} wallpapers in {Object.keys(props.listing).length} collection(s).
              </p>
              <div>
                <PreviewSet listing={props.listing}/>
              </div>
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
            
            {props.index > 1 ? <Link to={'/'+props.category+'/'+(props.index-1)} className="pagination-previous" >Previous</Link>:null}
            
            {props.index < props.max ? < Link to={'/'+props.category+'/'+(props.index+1)} className="pagination-next">Next page</Link>:null}
            
            <ul className="pagination-list">
            {props.index!==0
              ? ( <Fragment>
                    <li>
                        <Link to={'/'+props.category+'/1'} 
                            className={props.index===0?"pagination-link is-current":"pagination-link"}
                            aria-label={"Goto page 1"}>
                            1
                      </Link>
                    </li>
                    <li>
                      <span className="pagination-ellipsis">&hellip;</span>
                    </li>
                   </Fragment> )
              : (null) }
                    
              {new Array(maxsteps+1).fill(0).map((zero,index)=>
                index - stepratio + props.index >= 1 &&
                index - stepratio + props.index <= props.max
                
                ? (<li key={index}>
                  <NavLink className={(index-stepratio+props.index-1)===props.index?"pagination-link is-current":"pagination-link"}
                            aria-label={"Goto page "+(index -stepratio + props.index)} 
                            to={'/'+props.category+'/'+(index - stepratio + props.index)}>
                            {index - stepratio  + props.index}
                  </NavLink>
                </li>)
                : ( null )
                )}
                
              {props.index+1!==props.max
              ? ( <Fragment>
                  <li>
                    <span className="pagination-ellipsis">&hellip;</span>
                  </li>
                  <li>
                    <Link to={props.max.toString()} 
                      className={props.index===props.max?"pagination-link is-current":"pagination-link"}
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
      list      = props.listing[category]
  
  if (!list)
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
      chunkid   = props.params.page ? parseInt(props.params.page,10)-1 : 1,
      chunks    = chunkify(list,maxtiles)
      
  if (chunkid >= chunks.length || chunkid < 0)
    return (<div>
              <p>Invalid page number, try again.</p>
            </div>) 
  
  var chunk     = chunks[chunkid],
      papers    = chunk.map((node,key)=> <ImageTile key={key} 
                                                    src={publicUrl('wallpaper',node) } 
                                                    to={'/'+category+'/'+(chunkid+1)+'/'+node.split('/')[1] }
                                                    alt={node} 
                                                    name={node} />),
      
      contents  = (<Fragment>
                    <Pagination index={chunkid} max={Math.ceil(list.length/maxtiles) } category={category}/>
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
            <p> Total of {list.length} wallpapers in set</p>
            <p> Showing wallpapers {25*(chunkid)} through {25*(chunkid)+25} </p>
            {contents}
          
        </div>)
}

function NavMenu(props){
  var menucontent = Object.keys(props.listing).map((name)=>(
    <div className="navbar-item" key={name}>
      <NavLink to={'/'+name+'/'}
        onClick={(e)=> e.target.parentNode.parentNode.parentNode.classList.toggle('is-active')}
      >{name}</NavLink>
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
                  <figure className="image">
                    <a href={publicUrl('wallpaper',props.params.category,props.params.name)}
                          download>
                    <img src={publicUrl('wallpaper',props.params.category,props.params.name)}
                         alt={props.params.name}/> 
                    </a>
                  </figure>
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
                      to="/:category/1" />
                
                
              </div>
          </Fragment>)
}

function App(props) {
    return (<BrowserRouter basename="/wallfall">            
                <Container listing={props.listing} />
           </BrowserRouter>)
}


export default App