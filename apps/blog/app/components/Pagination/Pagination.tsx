type Props = {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

// TODO: 今は前後のページを表示するだけだが、ページが増えたときに最初のページと最後のページに楽に移動できるようにしたい
// 1 ... (currentPage -1 ) (currentPage) (currentPage + 1) ... N みたいな
export function Pagination(props: Props) {
  if (props.currentPage === 1 && !props.hasNext) return null;
  return (
    <div className="flex gap-4 justify-center items-center">
      {props.hasPrevious && <PagenationLink num={props.currentPage - 1} />}
      <div className="font-extrabold text-xl">{props.currentPage}</div>
      {props.hasNext && <PagenationLink num={props.currentPage + 1} />}
    </div>
  );
}

function PagenationLink({ num }: { num: number }) {
  return (
    <a className="text-secondary hover:text-green-8 text-lg" href={`/page/${num}/`}>
      {num}
    </a>
  );
}
