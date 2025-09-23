package com.example.app.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * 収支登録エンティティ
 * データベースのrecordsテーブルと1対1で対応
 */

@Data
public class Record {
	private Integer recordId;
	private Integer userId;
	private LocalDate recordDate;
	private String recordType;
	private Integer amount;
	private String category;
	private String memo;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
