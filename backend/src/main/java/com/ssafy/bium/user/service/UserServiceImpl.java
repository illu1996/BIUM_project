package com.ssafy.bium.user.service;

import com.ssafy.bium.user.User;
import com.ssafy.bium.user.repository.UserRepository;
import com.ssafy.bium.user.request.UserRegisterPostReq;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User searchUser(String userEmail, String userPw) {
//        Optional<User> findUser = userRepository.findById(id);
        Optional<User> findUser = userRepository.findByUserEmailAndUserPw(userEmail, userPw);
        if (!findUser.isPresent()) {
            System.out.println("로그인 실패");
            return null;
            // 예외 처리
        }
        User user = findUser.get();
        return user;
    }

    @Override
    public User setUser(UserRegisterPostReq userRegisterInfo) {

        User user = User.builder()
                .userEmail(userRegisterInfo.getUserEmail())
                .userPw(userRegisterInfo.getUserPw())
                .userName(userRegisterInfo.getUserName())
                .userNickname(userRegisterInfo.getUserNickname())
                .build();

        return userRepository.save(user);

    }

    @Override
    public int getUserByUserEmail(String userEmail) {
        Optional<User> findUser = userRepository.findByUserEmail(userEmail);
        if(findUser.isPresent()){
            System.out.println("이미 존재하는 이메일");
            return 1;
        }
        System.out.println("사용 가능한 이메일");
        return 0;
    }
}
