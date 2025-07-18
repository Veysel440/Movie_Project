import BaseTable from "../BaseTable";

export default function SeriesRatingsCommentsTable(props) {
  return (
    <BaseTable
      {...props}
      title="Dizi Yorumları ve Puanları"
      columns={["LINK", "EMAIL", "COMMENT", "RATING", "CREATED_AT"]}
      truncateFields={["COMMENT"]}
      modalTitles={{
        add: "Yeni Dizi Yorumu Ekle",
        edit: "Dizi Yorumunu Düzenle",
      }}
      keyField="LINK"
    />
  );
}
