import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { switchPopup } from '../../../redux/reducers/commonSlice';
import DefaultLayout from '../../layouts/DefaultLayout';
import RequirementList from '../RequirementList';
import { getAllRequirementAsync } from '../../../redux/reducers/requirementSlice';

export interface IUserHomeProps {}

export default function UserHome() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && !requirements) dispatch(getAllRequirementAsync({ userId: null }));

    return () => {
      dispatch(switchPopup({ isShowPopup: false, popupElement: null }));
    };
  }, [dispatch, requirements, user]);

  const handleClick = () => {
    dispatch(switchPopup({ isShowPopup: true, popupElement: <div>Popup</div> }));
  };

  return (
    <DefaultLayout>
      <div className="w-full flex justify-between gap-4 pr-4">
        <div className="w-8/12">
          <button type="button" onClick={handleClick}>
            Click me
          </button>
        </div>
        <RequirementList />
      </div>
    </DefaultLayout>
  );
}
