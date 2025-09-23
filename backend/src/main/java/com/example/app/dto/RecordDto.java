package com.example.app.dto;//収支記録データの受け取り・送信

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import lombok.Data;

@Data
public class RecordDto {
	
	private Integer recordId;//新規作成時はnull
	
	private LocalDate recordDate;//デフォルトは今日の日付
	
	private String recordType;//デフォルトはreceivedが選択
	
	@NotBlank(message = "お金を入力してね")
	@Positive(message = "お金は正の数で入力してね")
	private Integer amount;
	
	private String category;
	
	private String memo;
	
	private Integer userId;//セッションから取得
	
}
