import {useId,useState,type FormEvent,type KeyboardEvent} from 'react';
import {searchCinemaLibrary,type CinemaSearchResult} from '../data/cinema-search';
import {navigate,openLab} from '../legacy/bridge';
import './cinema-search.css';

function openResult(item:CinemaSearchResult){
  switch(item.entry.kind){
    case 'lesson': navigate('lesson',item.entry.id);break;
    case 'lab': openLab(item.entry.id);break;
    case 'roles': navigate('crafts');break;
  }
}

/** Small local search on Home. All results are real existing offline destinations. */
export function CinemaQuickFind({completed}:{completed:ReadonlySet<string>}){
  const [value,setValue]=useState('');
  const resultsId=useId();
  const query=value.trim();
  const matches=searchCinemaLibrary(query);
  const searching=query.length>0;
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(matches.results.length>0)openResult(matches.results[0]);
  };
  const keys=(event:KeyboardEvent<HTMLInputElement>)=>{
    if(event.key==='Escape'&&value){
      event.preventDefault();
      setValue('');
    }
  };
  return <section className="cinema-quick-find" data-cinema-quick-find aria-label="Find cinema lessons and experiments">
    <form role="search" className="cinema-quick-find-form" onSubmit={submit}>
      <label htmlFor={resultsId+'-input'}>Find a film craft</label>
      <div className="cinema-quick-find-input-row">
        <span className="cinema-quick-find-icon" aria-hidden="true">⌕</span>
        <input id={resultsId+'-input'} type="search" value={value} maxLength={80}
          placeholder="Try lighting, silence, editing…"
          autoComplete="off" spellCheck={false}
          aria-controls={resultsId} aria-describedby={resultsId+'-status'}
          onChange={event=>setValue(event.target.value)}
          onKeyDown={keys}
          data-cinema-search-input/>
        {value?<button type="button" className="cinema-quick-find-clear" data-cinema-search-clear
          onClick={()=>setValue('')} aria-label="Clear cinema search">Clear</button>:null}
      </div>
    </form>
    <div className="cinema-search-status" id={resultsId+'-status'} aria-live="polite" aria-atomic="true"
      data-cinema-search-status>
      {searching?(matches.total===0?'No matches. Try a different film term.':
        matches.total+' '+(matches.total===1?'result':'results')+
        (matches.total>matches.results.length?' · showing first '+matches.results.length:'')+
        ' · Press Enter to open the first result.') : ''}
    </div>
    {searching&&matches.results.length>0?
      <ul id={resultsId} className="cinema-search-results" data-cinema-search-results
        aria-label="Matching cinema lessons and labs">
        {matches.results.map(item=><li key={item.entry.kind+':'+item.entry.id}>
          <button type="button" className="cinema-search-result"
            data-cinema-search-result={item.entry.kind+':'+item.entry.id}
            onClick={()=>openResult(item)}>
            <span className="cinema-search-result-copy">
              <span className="cinema-search-result-category">
                {item.entry.kind==='lesson'?'LESSON · '+item.category:item.category.toUpperCase()}
                {item.minutes?' · '+item.minutes+' MIN':''}
                {item.entry.kind==='lesson'&&completed.has(item.entry.id)?' · COMPLETE':''}
              </span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
            <span aria-hidden="true" className="cinema-search-result-arrow">↗</span>
          </button>
        </li>)}
      </ul>:<div id={resultsId} hidden/>}
  </section>;
}
