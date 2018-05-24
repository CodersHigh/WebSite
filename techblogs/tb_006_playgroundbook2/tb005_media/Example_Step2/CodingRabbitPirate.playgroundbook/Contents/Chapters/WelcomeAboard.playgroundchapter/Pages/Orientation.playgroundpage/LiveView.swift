
import PlaygroundSupport
import UIKit

let page = PlaygroundPage.current
let orientationViewController: OrientationViewController = OrientationViewController.instantiateFromMainStoryboard()
page.liveView = orientationViewController

