import BaseTable from "../BaseTable";

export default function MovieActorsTable(props) {
  return (
    <BaseTable
      {...props}
      title="Film Oyuncuları"
      columns={["MOVIE_LINK", "ACTOR_NAME", "CHARACTER_NAME", "ACTOR_PHOTO"]}
      modalTitles={{
        add: "Yeni Film Oyuncusu Ekle",
        edit: "Film Oyuncusunu Düzenle",
      }}
      keyField="MOVIE_LINK"
    />
  );
}
