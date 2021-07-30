import { PropsWithChildren, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { LandingLayout } from '../Layout';
import { SpinnerOverlay } from '../SpinnerOverlay';
// import { getIsLoading, getMe, getToken, loadUser } from '@/lib/slices/session';
// import { useAppDispatch } from '@/lib/store';

interface Props {
  title?: string;
}

// export default function AuthenticatedLayout(
//   props: PropsWithChildren<Props>
// ): JSX.Element {
//   const me = useSelector(getMe);
//   const token = useSelector(getToken);
//   const isLoading = useSelector(getIsLoading);
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//
//   useEffect(() => {
//     if (!token && !me && !isLoading) {
//       router.push('/');
//       return;
//     }
//     if (!me && token && !isLoading) {
//       dispatch(loadUser());
//     }
//   }, [me, token, dispatch]);
//   return (
//     <LandingLayout title={props.title}>
//       <SpinnerOverlay spinning={!me || !token || isLoading} />
//       {props.children}
//     </LandingLayout>
//   );
// }
