import RequirementItem from '../RequirementItem';

export interface IRequirementListProps {}

export default function RequirementList() {
  return (
    <div className="bg-white max-w-[400px] w-[30%] h-[calc(100vh-64px)] rounded-3xl px-4 py-10">
      <h2 className="w-full text-start text-2xl text-black font-semibold">Yêu cầu sắp tới</h2>
      <div className="w-full h-full flex flex-col gap-4 overflow-y-auto pt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <RequirementItem
            key={item}
            title="Sức khoẻ cộng đồng"
            avatar="https://i.pravatar.cc/300"
            username="Phương Hồng"
            address="Hà Nội"
            date="2021-10-10"
            status="Đang chờ"
          />
        ))}
      </div>
    </div>
  );
}
