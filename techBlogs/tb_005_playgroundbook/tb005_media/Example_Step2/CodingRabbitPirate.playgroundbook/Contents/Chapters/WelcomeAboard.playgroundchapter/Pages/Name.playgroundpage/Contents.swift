//#-hidden-code
//  Contents.swift
//
//  Copyright (c) 2017 CodersHigh. All Rights Reserved.
//

import PlaygroundSupport
import Foundation
import UIKit


let page = PlaygroundPage.current
let proxy = page.liveView as? PlaygroundRemoteLiveViewProxy

func setName(_ name:String) {
    PassPort.shared.name = name
}

//#-end-hidden-code

/*:
 # Welcome to CodersHigh Cruse
 
 It's captain coding rabbit
 
 This is the very first stage of your aboard

 Follow the instruction
 
 Hope you have a good chance to improve your coding skill here
 
 
 
 ## Instruction
 Type your name using setName() function
 
 
     setName("CodingRabbit")
 */

//#-code-completion(everything, hide)
//#-code-completion(identifier, show, setName(_:))

//Set Your Name
//#-editable-code

//#-end-editable-code


//#-hidden-code
if page.text.contains("setName"){
    if let passportName = PassPort.shared.name {
    let successString = "Good " + passportName + ". You're ready to onboard. Go [Orientation](@next)"
    page.assessmentStatus = .pass(message:successString)
    }
}
//#-end-hidden-code








