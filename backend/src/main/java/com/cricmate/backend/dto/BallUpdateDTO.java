package com.cricmate.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // data automatically generates setters and getters
@AllArgsConstructor // a constructor that takes all fields
@NoArgsConstructor
public class BallUpdateDTO {
    private Integer overNumber;
    private Integer ballNumber;
    private Integer runs;
    private Boolean isWicket;

    private Integer inningsId;
    private Integer batsmanId;
    private Integer bowlerId;

    // getters + setters
}
