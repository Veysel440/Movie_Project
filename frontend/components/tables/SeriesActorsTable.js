import BaseTable from "../BaseTable";

export default function SeriesActorsTable(props) {
  return (
    <BaseTable
      {...props}
      title="Dizi Oyuncuları"
      columns={["SERIES_LINK", "ACTOR_NAME", "CHARACTER_NAME", "ACTOR_PHOTO"]}
      modalTitles={{
        add: "Yeni Dizi Oyuncusu Ekle",
        edit: "Dizi Oyuncusunu Düzenle",
      }}
      keyField="SERIES_LINK"
    />
  );
}
