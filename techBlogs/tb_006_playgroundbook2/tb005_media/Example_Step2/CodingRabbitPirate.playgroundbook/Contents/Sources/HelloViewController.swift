 import UIKit
 import PlaygroundSupport
 
 public class HelloViewController: UIViewController, PlaygroundLiveViewSafeAreaContainer {

    var nameLabel = UILabel()
    var cruseImageView = UIImageView(frame:CGRect(x: 60, y: 140 , width: 400, height: 400))
    var mainView = UIView()
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        self.view = mainView
        
        nameLabel.textColor = UIColor.black
        nameLabel.font = UIFont.systemFont(ofSize: 19.0, weight: UIFontWeightHeavy)
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        nameLabel.text = "CodersHigh Cruse"
        self.view.addSubview(nameLabel)
        
        self.view.addConstraints([NSLayoutConstraint(item: nameLabel,
                                                     attribute: .centerX,
                                                     relatedBy: .equal,
                                                     toItem: self.view,
                                                     attribute: .centerX,
                                                     multiplier: 1,
                                                     constant: 0),
                                  NSLayoutConstraint(item: nameLabel,
                                                     attribute: .top,
                                                     relatedBy: .equal,
                                                     toItem: self.view,
                                                     attribute: .top,
                                                     multiplier: 1,
                                                     constant: 30)])
        
        
        
        cruseImageView.image = UIImage(named: "Cruse.png")
        view.addSubview(cruseImageView)
        
        view.addConstraints([NSLayoutConstraint(item: cruseImageView,
                                                attribute: .leading,
                                                relatedBy: .equal,
                                                toItem: view,
                                                attribute: .leading,
                                                multiplier: 1,
                                                constant: 0),
                             NSLayoutConstraint(item: cruseImageView,
                                                attribute: .trailing,
                                                relatedBy: .equal,
                                                toItem: view,
                                                attribute: .trailing,
                                                multiplier: 1,
                                                constant: 0),
                             NSLayoutConstraint(item: cruseImageView,
                                                attribute: .top,
                                                relatedBy: .equal,
                                                toItem: nameLabel,
                                                attribute: .bottom,
                                                multiplier: 1,
                                                constant: 20),
                             NSLayoutConstraint(item:cruseImageView,
                                                attribute: .bottom,
                                                relatedBy: .equal,
                                                toItem: view,
                                                attribute: .bottom,
                                                multiplier: 1,
                                                constant: -60
            )])
    }
 }
 
 extension HelloViewController: PlaygroundLiveViewMessageHandler {
    public func receive(_ message: PlaygroundValue) {
    }
 }

 
