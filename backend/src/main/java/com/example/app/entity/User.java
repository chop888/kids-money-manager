package com.example.app.entity;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * ユーザーエンティティ
 * データベースのrecordsテーブルと1対1で対応
 */

@Data
public class User {

	private Integer userId;
	private String lastName;
	private String firstName;
	private String nickname;
	private String password;//ハッシュ化
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
