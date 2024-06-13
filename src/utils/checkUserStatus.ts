import { Requirement } from '../types/requirement';
import { User } from '../types/user';

export default function checkUserStatus(requirement: Requirement | null, allRequirement: Requirement[], user: User) {
  const startDate = new Date(requirement?.startDate ?? '');
  const endDate = new Date(requirement?.endDate ?? '');

  // filter all requirements that have user id
  const userRequirements = allRequirement?.filter((requirement: Requirement) => {
    const str = JSON.stringify(requirement);
    return str.includes(user.id);
  });
  console.log('🚀 ~ userRequirements ~ userRequirements:', userRequirements);

  userRequirements?.map((req: Requirement) => {
    console.log('🚀  startDate:', new Date(req.startDate), startDate, new Date(req.endDate), startDate);
    if (
      (new Date(req.startDate) < startDate && new Date(req.endDate) > startDate) ||
      (new Date(req.startDate) < endDate && new Date(req.endDate) > endDate)
    ) {
      return false;
    }
  });
  return true;
}
