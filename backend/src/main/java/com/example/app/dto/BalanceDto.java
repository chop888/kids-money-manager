package com.example.app.dto;//残高情報の送信

import lombok.Data;

@Data
public class BalanceDto {
	
	private Integer userId;
	private Integer balance;//現在の残高
	private Integer totalReceived;//総収入
	private Integer totalSpent;//総支出

}
