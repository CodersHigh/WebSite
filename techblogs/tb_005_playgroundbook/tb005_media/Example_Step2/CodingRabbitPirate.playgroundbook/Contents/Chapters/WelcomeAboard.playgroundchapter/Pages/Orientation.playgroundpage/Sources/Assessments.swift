//
//  Assessments.swift
//
//  Copyright (c) 2017 Kevin Jin. All Rights Reserved.


import PlaygroundSupport

public func evaluateForAssessment(_ arrivedArray: [PlaygroundValue]) {
    
    var hints = ["hint array 안 string이 아직 manipulate 되지 않았으므로 이게 표시되면 뭔가 잘못된거임"]
    
    let checker = arrivedArray.reduce(0) {
        (codeChecker, valueInArray) -> Int in
        guard case let PlaygroundValue.boolean(output) = valueInArray else {
            return 1001
        }
        if output == false {
            return codeChecker + 1
        }
        return codeChecker
    }
    
    if checker == 0 {
        PlaygroundPage.current.assessmentStatus = .pass(message: "코드가 모든 테스트 케이스를 통과했습니다! 이제 다음 페이지로 이동해보세요.")
        
    } else if checker > 0 && checker < 999 {
        hints[0] = "`return \"Hello, \\(name)!\"` 이 정답이 되겠죠?"
        
        PlaygroundPage.current.assessmentStatus = .fail(hints: hints, solution: nil)
    } else {
        hints[0] = "(bug)도착한 어레이에서 bool값을 제대로 빼오지 못했습니다."
        PlaygroundPage.current.assessmentStatus = .fail(hints: hints, solution: nil)
    }
}

