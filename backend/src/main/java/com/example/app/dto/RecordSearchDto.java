package com.example.app.dto;//履歴画面での検索条件

import java.time.LocalDate;

import lombok.Data;

@Data
public class RecordSearchDto {

	private String keyword;
	private LocalDate startDate;
	private LocalDate endDate;
	private String recordType;//"received", "spent"または"all"
	private String category;
	private Integer userId;//セッションから取得

}
