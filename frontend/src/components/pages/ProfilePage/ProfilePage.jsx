import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { setNickname, setImageId, setDisturb } from '../../../slices/userSlice';
import { GetRanking } from '../../organisms/RankingList';
import useGetBiumTime from '../../../hooks/TimeInquery';
import axios from 'axios';
import { persistor } from '../../../store/store';
import emptyprofile from '../../../asset/backgroudimage/emptyprofile.png';

export function ProfilePage() {
  const { userEmail } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 기존 스토어의 유저 정보
  const savedEmail = useSelector((state) => state.user.userEmail);
  const savedNickname = useSelector((state) => state.user.nickname);
  const savedTodayBium = useSelector((state) => state.user.todayBium);
  const savedTotalBium = useSelector((state) => state.user.totalBium);
  const savedProfileImage = useSelector((state) => state.user.imageId);
  const savedDisturbImage = useSelector((state) => state.user.disturb);

  // 회원 정보 수정의 기본값은 store 기본값에 한정
  const [name, setName] = useState(savedNickname);
  const [existingPassword, setExistingPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newpasswordConfirm, setNewPasswordConfirm] = useState('');
  const todayBium = useGetBiumTime(savedTodayBium);
  const totalBium = useGetBiumTime(savedTotalBium);
  const [profileimage, setProfileImage] = useState(null);
  const [disturbImage, setDisturbImage] = useState(null);

  // 프로필 이미지와 방해이미지가 바뀌는 상태를 관리하는 state
  const [showProfile, setShowProfile] = useState(true);

  // 회원 탈퇴 확인 모달의 상태를 관리하는 state
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);

  // 회원 정보 수정 모달 오픈 여부
  const [modalOpen, setModalOpen] = useState(false);

  // 프로필 이미지 저장
  const saveProfile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log('file', file);
    if (file) {
      dispatch(setImageId(URL.createObjectURL(file)));
      setProfileImage(file);
      console.log('프로필 이미지', file);
    }
  };

  // 방해 이미지 저장
  const saveDisturb = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log('file', file);
    if (file) {
      dispatch(setDisturb(URL.createObjectURL(file)));
      setDisturbImage(file);
      console.log('방해 이미지', file);
    }
  };

  // 프로필 이미지 전송
  const sendToProfile = async (e) => {
    e.preventDefault();
    if (profileimage) {
      console.log('프로필 이미지', profileimage);
      const formData = new FormData();
      formData.append('file', profileimage);
      for (let pair of formData.entries()) {
        console.log('프로필 이미지 formData', pair[0] + ', ' + pair[1]);
      }
      console.log(formData);
      try {
        const profileResponse = await axios.post(`http://localhost:8080/api/profile/img/${savedEmail}`, formData, {
          params: {
            imgType: 1
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: [
            function () {
              return formData;
            }
          ]
        });
        console.log(profileResponse.data);
        if (profileResponse.status === 200) {
          dispatch(setImageId(profileResponse.data.saveFile));

          console.log(dispatch(setImageId(profileResponse.data.saveFile)));
          console.log('서버 전송 성공', profileResponse.data.saveFile);

          // 프로필 이미지 조회
          const saveFile = profileResponse.data.saveFile;
          const saveFolder = profileResponse.data.saveFolder;
          const imgType = profileResponse.data.imgType;
          const originalFile = profileResponse.data.originalFile;

          const getProfileResponse = await axios.get(
            `http://localhost:8080/api/file/${saveFolder}/${imgType}/${originalFile}/${saveFile}`,
            { responseType: 'blob' }
          );

          const imgSrc = URL.createObjectURL(getProfileResponse.data);
          dispatch(setImageId(imgSrc));

          console.log('seTtidmfd', setImageId(imgSrc));
          console.log('조회 성공', imgSrc);
        } else {
          console.log('서버 응답 오류');
        }
      } catch (error) {
        console.log('전송 실패', error);
      }
    }
  };

  // 방해 이미지 전송
  const sendToDisturb = async (e) => {
    e.preventDefault();
    if (disturbImage) {
      console.log('방해이미지', disturbImage);
      const formData = new FormData();
      formData.append('file', disturbImage);
      for (let pair of formData.entries()) {
        console.log('방해이미지 formData', pair[0] + ', ' + pair[1]);
      }
      console.log(formData);
      try {
        const disturbResponse = await axios.post(`http://localhost:8080/api/profile/img/${savedEmail}`, formData, {
          params: {
            imgType: 2
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: [
            function () {
              return formData;
            }
          ]
        });
        console.log(disturbResponse.data);
        if (disturbResponse.status === 200) {
          dispatch(setDisturb(disturbResponse.data.saveFile));
          console.log('서버 전송 성공', disturbResponse);

          // 방해 이미지 조회
          const saveFile = disturbResponse.data.saveFile;
          const saveFolder = disturbResponse.data.saveFolder;
          const imgType = disturbResponse.data.imgType;
          const originalFile = disturbResponse.data.originalFile;

          const getDisturbResponse = await axios.get(
            `http://localhost:8080/api/file/${saveFolder}/${imgType}/${originalFile}/${saveFile}`,
            { responseType: 'blob' }
          );

          const imgSrc = URL.createObjectURL(getDisturbResponse.data);
          dispatch(setDisturb(imgSrc));

          console.log('seTtidmfd', setDisturb(imgSrc));
          console.log('조회 성공', imgSrc);
        } else {
          console.log('서버 응답 오류');
        }
      } catch (error) {
        console.log('전송 실패', error);
      }
    }
  };

  // 프로필 이미지 삭제
  const deleteProfile = () => {
    if (profileimage) {
      setProfileImage(null);
      dispatch(setImageId(null));
    }
  };

  // 방해 이미지 삭제
  const deleteDisturb = () => {
    if (disturbImage) {
      setDisturbImage(null);
      dispatch(setDisturb(null));
    }
  };

  function openModal() {
    setModalOpen(true);
  }

  // 모달창을 닫을 시 기존 input에 입력된 값 초기화
  function closeModal() {
    setModalOpen(false);
    setName(savedNickname);
    setExistingPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  }

  // 기존 비밀번호 확인
  const checkPassword = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/profile/checkpw`,
        {
          userEmail: savedEmail,
          userPw: existingPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('비밀번호 확인', response.status);
      if (response.status === 200) {
        return true;
      }
      console.log(response.status);
      return false;
    } catch (error) {
      console.log('너 오류난 거야', error);
      return false;
    }
  };

  const modifyUserInfo = async (e) => {
    e.preventDefault();

    const validatePassword = await checkPassword();

    console.log(validatePassword);
    if (validatePassword === false) {
      alert('잘못된 비밀번호를 입력하셨습니다.');
      return;
    }

    try {
      if (newPassword !== newpasswordConfirm) {
        return alert('비밀번호가 일치하지 않습니다.');
      }

      const data = {
        userEmail: savedEmail,
        userNickname: name,
        userPw: newPassword
      };
      const response = await axios.post(`http://localhost:8080/api/profile/modify`, data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'POST'
          // Authorization: `Bearer ${accessToken}`
        }
      });

      console.log(response);
      if (response.status === 200) {
        dispatch(setNickname(name));
        // setName(updatedNickname);
        persistor.flush();
        closeModal();
      }
    } catch (error) {
      console.error('회원 정보 수정에 실패하였습니다.', error);
    }
  };

  // 회원 탈퇴 요청
  const signOutUser = async (e) => {
    e.preventDefault();

    const validatePassword = await checkPassword();

    console.log(validatePassword);
    if (validatePassword === false) {
      alert('잘못된 비밀번호를 입력하셨습니다.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/profile/delete`,
        {},
        {
          params: {
            userEmail: savedEmail
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data);
      if (response.data === 0) {
        sessionStorage.removeItem('accessToken');
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return error;
    }
  };

  // 회원 탈퇴 확인 모달을 열고 닫는 함수들
  const openDeleteConfirmModal = () => {
    setDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmModalOpen(false);
  };

  // 회원 탈퇴 확인 모달에서 '예, 탈퇴합니다' 버튼을 눌렀을 때의 동작
  const confirmSignOut = (e) => {
    signOutUser(e);
    closeDeleteConfirmModal();
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.header}>
        <div></div>
        <div>
          <h1>ProfilePage</h1>
        </div>
      </div>
      <div className={styles.sideLeft}>
        {showProfile ? (
          <div>
            <p>프로필 이미지</p>
            {savedProfileImage ? (
              <img src={savedProfileImage} alt="미리보기" />
            ) : (
              <img src={emptyprofile} alt="미리보기" />
            )}
            <div>
              <input name="file" type="file" accept="image/*" onChange={saveProfile}></input>
            </div>
            <button onClick={sendToProfile}>이미지 서버 전송</button>
            <div>
              <button onClick={deleteProfile}>삭제</button>
            </div>
          </div>
        ) : (
          <div>
            <p>방해 이미지</p>
            {savedDisturbImage ? (
              <img src={savedDisturbImage} alt="미리보기" />
            ) : (
              <img src={emptyprofile} alt="미리보기" />
            )}
            <div>
              <input name="file" type="file" accept="image/*" onChange={saveDisturb}></input>
            </div>
            <button onClick={sendToDisturb}>이미지 서버 전송</button>
            <div>
              <button onClick={deleteDisturb}>삭제</button>
            </div>
          </div>
        )}
        <button onClick={() => setShowProfile(!showProfile)}>토글 이미지</button>
        <h3>닉네임</h3>
        <h3>{savedNickname}</h3>
        <h3>오늘 비움량 : {todayBium}</h3>
        <h3>총 비움량 {totalBium}</h3>
        <button className={styles.modifyButton} onClick={openModal}>
          회원 정보 수정
        </button>
        {modalOpen && (
          <div className={styles.modal}>
            <h2>회원정보 수정</h2>
            <form>
              <div>{savedProfileImage && <img src={savedProfileImage} alt="미리보기" />}</div>
              <div>{savedNickname}</div>
              <label>
                닉네임:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </label>
              <br />
              <label>
                기존비밀번호:
                <input
                  type="password"
                  autoComplete="off"
                  value={existingPassword}
                  onChange={(e) => setExistingPassword(e.target.value)}
                />
              </label>
              <br />
              <label>
                비밀번호:
                <input
                  type="password"
                  autoComplete="off"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <br />
              <label>
                비밀번호확인:
                <input
                  type="password"
                  autoComplete="off"
                  value={newpasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </label>
            </form>
            <button onClick={modifyUserInfo}>수정하기</button>
            <button onClick={openDeleteConfirmModal}>회원 탈퇴</button>

            <button className={styles.overlay} onClick={closeModal}>
              닫기
            </button>
          </div>
        )}
        {/* css 적용시 .modal이 아닌 다른 css 적용 필요 */}
        {deleteConfirmModalOpen && (
          <div className={styles.modal}>
            <h2>정말로 탈퇴하시겠어요?</h2>

            <button onClick={confirmSignOut}>예</button>
            <button onClick={closeDeleteConfirmModal}>아니요</button>
          </div>
        )}
      </div>
      <div className={styles.sideRight}>
        <GetRanking />
      </div>
    </div>
  );
}
