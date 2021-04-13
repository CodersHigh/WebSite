 import UIKit
 import PlaygroundSupport

 
 
 public class OrientationViewController: UIViewController, PlaygroundLiveViewSafeAreaContainer {

    var mainView : UIView = UIView()

    
    public override func viewDidLoad() {
        super.viewDidLoad()
        view = mainView
        
    }
 }

 
