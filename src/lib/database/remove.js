export default function(endpoint, db, fn){
  return db().ref().child(endpoint).remove(fn);
}
