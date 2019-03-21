export default function( className, d ) {
  const
    htmlElement = d.querySelectorAll('html')[0]
  ;
  htmlElement.classList.add( className );
}
